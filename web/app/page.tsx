"use client";

import { useEffect, useReducer, useState } from "react";

import { reducer } from "@/state/reducer";
import { initialState } from "@/state/initial";

import { useHotels } from "@/hooks/useHotels";
import { usePrices } from "@/hooks/usePrices";
import { useNormalizedSelected } from "@/hooks/useNormalizedSelected";
import { useRateMatrix } from "@/hooks/useRateMatrix";
import { useReviews } from "@/hooks/useReviews";
import { MENU_MAP, MenuType } from "@/constants/menu";

import Header from "@/components/layout/header/Header";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import SidebarMenu from "@/components/layout/sidebar/SidebarMenu";
import Modal from "@/components/common/Modal";
import BaseHotelMenu from "@/components/layout/sidebar/menus/BaseHotelMenu";
import SelectHotelMenu from "@/components/layout/sidebar/menus/SelectHotelMenu";
import Layer1 from "@/components/views/Layer1";
import Layer2 from "@/components/views/Layer2";

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { baseHotel, selected, pinned, year, month, layer } = state;

  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuType | null>(null);

  const { hotels, hotelMap } = useHotels();

  const displaySelected = useNormalizedSelected(selected, baseHotel);

  const data = usePrices(displaySelected, year, month, layer);
  const rateMatrix = useRateMatrix(displaySelected, year, month, layer);
  const reviewData = useReviews(displaySelected, layer);

  const closeAll = () => {
    setActiveMenu(null);
    setIsOpen(false);
  };

  if (baseHotel === null) return <div>Loading...</div>;

  const modalContent = (() => {
    if (activeMenu === "base") {
      return (
        <BaseHotelMenu
          hotels={hotels}
          baseHotel={baseHotel}
          hotelMap={hotelMap}
          pinnedIds={pinned}
          onChange={(id) => dispatch({ type: "SET_BASE", id })}
        />
      );
    }

    if (activeMenu === "select") {
      return (
        <SelectHotelMenu
          hotels={hotels}
          baseHotel={baseHotel}
          selected={selected}
          hotelMap={hotelMap}
          pinnedIds={pinned}
          onAdd={(id) => dispatch({ type: "SELECT_ADD", id })}
          onRemove={(id) => dispatch({ type: "SELECT_REMOVE", id })}
        />
      );
    }
    return null;
  })();

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{
        width: "100%",
        maxWidth: "1600px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: "0 16px"
      }}>
        
        {/* ===== HEADER ===== */}
        <Header
          year={year}
          month={month}
          setYear={(y) => dispatch({ type: "SET_YEAR", year: y })}
          setMonth={(m) => dispatch({ type: "SET_MONTH", month: m })}
          baseHotel={baseHotel}
          hotelMap={hotelMap}
          onOpenMenu={(m) => {
            setActiveMenu(m);
            setIsOpen(true);
          }}
        />

        {/* ===== BODY ===== */}
        <div style={{ flex: 1, display: "flex", minHeight: 0, position: "relative" }}>
          
          {/* overlay */}
          {isOpen && (
            <div
              onClick={closeAll}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.2)",
                zIndex: 15
              }}
            />
          )}

          {/* sidebar */}
          <Sidebar isOpen={isOpen} onToggle={() => setIsOpen(v => !v)}>
            <SidebarMenu 
              activeMenu={activeMenu}
              setActiveMenu={(m) => {
                setActiveMenu(m);
                setIsOpen(false);
              }}
            />
          </Sidebar>

          {/* modal */}
          <Modal open={!!modalContent} onClose={closeAll}>
              {modalContent}
          </Modal>

          {/* ===== MAIN ===== */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "16px",
            paddingLeft: "46px",
            minWidth: 0,
            overflow: "hidden"
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Layer1 */}
              <div style={{ flex: "0 0 600px", borderBottom: "1px solid #e5e7eb", paddingBottom: "16px" }}>
                <div style={{ marginBottom: "8px", fontSize: "11px", color: "#999" }}>
                  LAYER 1 / ACT
                </div>

                <Layer1
                  data={data}
                  reviewData={reviewData}
                  hotelMap={hotelMap}
                  view={{
                    baseHotel,
                    displaySelected,
                    pinned
                  }}
                  actions={{
                    pin: (id: number) => dispatch({ type: "PIN_ADD", id }),
                    unpin: (id: number) => dispatch({ type: "PIN_REMOVE", id })
                  }}
                />
              </div>

              {/* Layer2 */}
              <div style={{ flex: "0 0 600px", borderBottom: "1px solid #e5e7eb", paddingBottom: "16px" }}>
                <div style={{ marginBottom: "8px", fontSize: "11px", color: "#999" }}>
                  LAYER 2 / SO WHAT
                </div>

                <Layer2 
                  rateMatrix={rateMatrix}
                  hotelMap={hotelMap}
                  year={year}
                  month={month}
                  view={{
                    baseHotel,
                    displaySelected,
                    pinned
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}