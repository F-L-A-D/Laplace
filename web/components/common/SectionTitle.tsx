export default function SectionTitle({ title }: {title: string}){
    return (
      <div style={{ 
        fontSize: "13px",
        fontWeight: "bold", 
        letterSpacing: "0.5px",
        color: "#444"
      }}
    >
      {title}
    </div>
  );
}