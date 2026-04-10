// web/app/page.tsx

"use client";

import { useEffect, useState } from "react";

import { useHotels } from "@/hooks/useHotels";
import { usePrices } from "@/hooks/usePrices";
import { useNormalizedSelected } from "@/hooks/useNormalizedSelected";
import { useRateMatrix } from "@/hooks/useRateMatrix";

import Header from "@/components/layout/header/Header";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import SidebarMenu from "@/components/layout/sidebar/SidebarMenu";
import Layer1 from "@/components/views/Layer1";
import Layer2 from "@/components/views/Layer2";

export default function Home() {
  const [pinnedIds, setPinnedIds] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [menu, setMenu] = useState<"base" | "select" | null>(null);

  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("04");

  const {
    hotels,
    hotelMap,
    selected,
    setSelected,
    baseHotel,
    setBaseHotel
  } = useHotels();

  const displaySelected = useNormalizedSelected(
    selected,
    baseHotel
  );

  const data = usePrices(
    displaySelected,
    year,
    month
  );

  const rateMatrix = useRateMatrix(
    displaySelected,
    year,
    month
  );

  useEffect(() => {
    setPinnedIds(prev => prev.filter(id => displaySelected.includes(id)));
  }, [selected]);
  
  if (baseHotel === null) return <div>Loading...</div>;

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
          isOpen={isOpen}
          menu={menu}
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
              <div style={{ 
                flex: "0 0 600px",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "16px"
              }}>
                <div style={{ 
                  marginBottom: "8px", 
                  fontSize: "11px", 
                  color: "#999", 
                  letterSpacing: "0.05em" 
                }}>
                  LAYER 1 / ACT
                </div>
                  <Layer1
                    data={data}
                    baseHotel={baseHotel}
                    hotelMap={hotelMap}
                    selected={selected}
                    displaySelected={displaySelected}
                    setSelected={setSelected}
                    pinnedIds={pinnedIds}
                    setPinnedIds={setPinnedIds}
                  />
              </div>
              {/* ===== Layer2 ===== */}
              <div style={{ 
                flex: "0 0 600px",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "16px"
              }}>
                <div style={{ 
                  marginBottom: "8px", 
                  fontSize: "11px", 
                  color: "#999", 
                  letterSpacing: "0.05em" 
                }}>
                  LAYER 2 / SO WHAT
                </div>
                  <Layer2 
                    rateMatrix={rateMatrix}
                    selected={displaySelected}
                    baseHotel={baseHotel}
                    hotelMap={hotelMap}
                    year={year}
                    month={month}
                    pinnedIds={pinnedIds}
                    setPinnedIds={setPinnedIds}
                  />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}