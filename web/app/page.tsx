"use client";

import { useEffect, useState, useMemo } from "react";
import Header from "@/components/layout/header/Header";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import SidebarMenu from "@/components/layout/sidebar/SidebarMenu";
import Layer1 from "@/components/layers/Layer1";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [baseHotel, setBaseHotel] = useState<number | null>(null);
  const [hotelMap, setHotelMap] = useState<Record<number, string>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [menu, setMenu] = useState<"base" | "select" | null>(null);

  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("04");

  // ------------------------
  // ホテル取得
  // ------------------------
  useEffect(() => {
    fetch("/api/hotels")
      .then(res => res.json())
      .then(list => {
        list.sort((a: any, b: any) =>
          a.name.localeCompare(b.name, "en")
        );

        setHotels(list);

        const map: Record<number, string> = {};
        list.forEach((h: any) => (map[h.id] = h.name));
        setHotelMap(map);

        const ids = list.slice(0, 3).map((h: any) => h.id);
        setSelected(ids);
        setBaseHotel(ids[0]);
      });
  }, []);

  // ------------------------
  // 自社強制表示
  // ------------------------
  const normalizedSelected = useMemo(() => {
    if (!baseHotel) return selected;
    return selected.includes(baseHotel)
      ? selected
      : [baseHotel, ...selected];
  }, [selected, baseHotel]);

  // ------------------------
  // 価格取得
  // ------------------------
  useEffect(() => {
    if (!normalizedSelected.length) return;

    const lastDay = new Date(
      Number(year),
      Number(month),
      0
    ).getDate();

    const start = `${year}-${month}-01`;
    const end = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;

    fetch(
      `/api/prices?hotel_ids=${normalizedSelected.join(
        ","
      )}&start_date=${start}&end_date=${end}`
    )
      .then(res => res.json())
      .then(json => {
        const grouped: any = {};

        json.forEach((r: any) => {
          const date = r.date.slice(0, 10);

          if (!grouped[date]) grouped[date] = { date };

          grouped[date][`hotel_${r.hotel_id}`] = r.price;
        });

        setData(Object.values(grouped));
      });
  }, [normalizedSelected, year, month]);

  if (baseHotel === null) return <div>Loading...</div>;

  const sidebarWidth = isOpen ? 200 : 30;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* ===== 横幅コンテナ ===== */}
      <div
        style={{
          width: "100%",
          maxWidth: "1600px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "0 16px"
        }}
      >
        {/* ===== Header ===== */}
        <Header
          year={year}
          month={month}
          setYear={setYear}
          setMonth={setMonth}
          baseHotel={baseHotel}
          hotelMap={hotelMap}
          setIsOpen={setIsOpen}
          setMenu={setMenu}
        />

        {/* ===== 本体 ===== */}
        <div style={{ flex: 1, display: "flex", minHeight: 0, position: "relative" }}>
          
          {/* ===== サイドバー ===== */}
          <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(v => !v)}>
            <SidebarMenu
              menu={menu}
              setMenu={setMenu}
              hotels={hotels}
              selected={selected}
              setSelected={setSelected}
              baseHotel={baseHotel}
              setBaseHotel={setBaseHotel}
              hotelMap={hotelMap}
            />
          </Sidebar>

          {/* ===== メイン ===== */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "16px",
              paddingLeft: "46px",
              minWidth: 0,
              overflow: "hidden"
            }}
          >
            {/* ===== Layers ===== */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px"
              }}
            >
              {/* ===== Layer1（今は固定高さ） ===== */}
              <div style={{ flex: "0 0 600px" }}>
                <Layer1
                  data={data}
                  selected={normalizedSelected}
                  baseHotel={baseHotel}
                  hotelMap={hotelMap}
                  setSelected={setSelected}
                />
              </div>

              {/* 将来ここにLayer2追加 */}
              {/*
              <div style={{ flex: 1, minHeight: 0 }}>
                <Layer2 ... />
              </div>
              */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}