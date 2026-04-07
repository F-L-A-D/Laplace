"use client";

import { useEffect, useState } from "react";
import PriceChart from "@/components/PriceChart";
import HotelSelector from "@/components/HotelSelector";
import SoldOutTable from "@/components/SoldOutTable";
import ReviewTable from "@/components/ReviewTable";
import RateDiffTable from "@/components/RateDiffTable";
import HeatMap from "@/components/HeatMap";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [baseHotel, setBaseHotel] = useState<number | null>(null);
  const [hotelMap, setHotelMap] = useState<Record<number,string>>({});
  const [reviewMap, setReviewMap] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);

  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("04");

  // ------------------------
  // ホテル取得
  // ------------------------
  useEffect(() => {
    fetch("/api/hotels")
      .then(res => res.json())
      .then(list => {
        list.sort((a:any,b:any)=>a.name.localeCompare(b.name,"en"));

        setHotels(list);

        const map:Record<number,string> = {};
        list.forEach((h:any)=> map[h.id] = h.name);
        setHotelMap(map);

        const ids = list.slice(0,3).map((h:any)=>h.id);
        setSelected(ids);
        setBaseHotel(ids[0]);
      });
  }, []);

  // ------------------------
  // 価格取得
  // ------------------------
  useEffect(() => {
    if (!selected.length) return;

    const lastDay = new Date(Number(year), Number(month), 0).getDate();

    const start = `${year}-${month}-01`;
    const end = `${year}-${month}-${String(lastDay).padStart(2,"0")}`;

    fetch(`/api/prices?hotel_ids=${selected.join(",")}&start_date=${start}&end_date=${end}`)
      .then(res => res.json())
      .then(json => {

        const grouped:any = {};

        json.forEach((r:any)=>{
          const date = r.date.slice(0,10);

          if(!grouped[date]) grouped[date] = { date };

          grouped[date][`hotel_${r.hotel_id}`] = r.price;
        });

        setData(Object.values(grouped));
      });

  }, [selected, year, month]);

  // ------------------------
  // 自社強制表示
  // ------------------------
  const normalizedSelected = baseHotel
    ? selected.includes(baseHotel)
      ? selected
      : [baseHotel, ...selected]
    : selected;

  if (baseHotel === null) return <div>Loading...</div>;

  return (
    <div style={{ display:"flex" }}>

      {/* ===== サイドバー ===== */}
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        style={{
          width: isOpen ? "260px" : "50px",
          transition: "0.2s",
          borderRight: "1px solid #ddd",
          padding: "10px"
        }}
      >
        ☰
        {isOpen && (
          <HotelSelector
            hotels={hotels}
            selected={selected}
            setSelected={setSelected}
            baseHotel={baseHotel}
            setBaseHotel={setBaseHotel}
          />
        )}
      </div>

      {/* ===== メイン ===== */}
      <div style={{ flex:1, padding:"16px" }}>

        {/* ===== タイトル＆年月 ===== */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ marginBottom: "8px" }}>Price Dashboard</h2>

          <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
            <div style={{ fontWeight:"bold" }}>SELECT MONTH: </div>

            <select value={year} onChange={e=>setYear(e.target.value)}>
              {["2025","2026","2027"].map(y=>(
                <option key={y}>{y}</option>
              ))}
            </select>

            <select value={month} onChange={e=>setMonth(e.target.value)}>
              {Array.from({length:12},(_,i)=>
                String(i+1).padStart(2,"0")
              ).map(m=>(
                <option key={m}>{m}</option>
              ))}
            </select>

            <div style={{ color:"#666" }}>
              {year}/{month}
            </div>
          </div>
        </div>

        {/* ===== 1段目 ===== */}
        <div style={{ display: "flex", gap: "24px" }}>
          <div style={{ flex: 1.5 }}>
            <PriceChart
              data={data}
              selected={normalizedSelected}
              baseHotel={baseHotel}
              hotelMap={hotelMap}
            />
          </div>

          <div style={{ flex: 0.7 }}>
            <ReviewTable {...{selected:normalizedSelected,hotelMap,reviewMap,baseHotel}} />
            <SoldOutTable {...{data,selected:normalizedSelected,hotelMap,baseHotel}} />
          </div>
        </div>

        {/* ===== 2段目 ===== */}
        <div style={{ display: "flex", gap: "24px", marginTop:"24px" }}>
          <div style={{ flex:1 }}>
            <RateDiffTable
              data={data}
              selected={normalizedSelected}
              hotelMap={hotelMap}
              baseHotel={baseHotel}
            />
          </div>

          <div style={{ flex:1 }}>
            <HeatMap
              data={data}
              selected={normalizedSelected}
              hotelMap={hotelMap}
              baseHotel={baseHotel}
            />
          </div>
        </div>

      </div>
    </div>
  );
}