import { ImageResponse } from "next/og";

export const alt = "HKGpipi — Cloud Margin Recovery";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#F5F5F0",
        color: "#11120F",
        display: "flex",
        height: "100%",
        padding: "64px",
        width: "100%",
      }}
    >
      <div
        style={{
          border: "2px solid #D8D9D2",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px 56px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, fontWeight: 600, letterSpacing: "-0.04em" }}>HKGpipi</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 0.96 }}>
            Cloud Margin Recovery
          </div>
          <div style={{ display: "flex", fontSize: 28, lineHeight: 1.35, maxWidth: "880px" }}>
            Engineering-led AWS cost reduction, verified against the bill.
          </div>
        </div>
        <div style={{ background: "#3157FF", display: "flex", height: "8px", width: "128px" }} />
      </div>
    </div>,
    size,
  );
}
