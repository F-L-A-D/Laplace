export default function SectionTitle({ title }: {title: string}){
    return (
      <div style={{ 
        fontSize: "13px",
        fontWeight: "bold", 
        marginBottom: "6px",
        paddingBottom: "4px",
        borderBottom: "1px solid #ddd", 
        letterSpacing: "0.5px",
        color: "#444"
      }}
    >
      {title}
    </div>
  );
}