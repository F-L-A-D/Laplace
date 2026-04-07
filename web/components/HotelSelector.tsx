"use client";

import HotelName from "./HotelName";

export default function HotelSelector({
  hotels,
  selected,
  setSelected,
  baseHotel,
  setBaseHotel,
}: any) {

  const toggle = (id:number)=>{
    if(selected.includes(id)){
      setSelected(selected.filter((x:number)=>x!==id));
    }else{
      setSelected([...selected,id]);
    }
  };

  return (
    <div>
      <div style={{ fontSize:"15px", marginBottom:"8px", color:"#666" }}>
        ● 自社 / ☑ 表示
      </div>
            {hotels.map((h:any)=>(
              <div key={h.id} style={{ display:"flex", gap:"6px", alignItems:"center" }}>
                
        <input
          type="radio"
          name="baseHotel"
          checked={baseHotel === h.id}
          onChange={()=>setBaseHotel(h.id)}
        />

        <input
          type="checkbox"
          checked={selected.includes(h.id) || h.id === baseHotel}
          disabled={h.id === baseHotel}
          onChange={()=>toggle(h.id)}
        />

        <HotelName name={h.name} />

      </div>
      ))}
    </div>
  );
}