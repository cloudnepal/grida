import { grida } from "@/grida";

const svg_1 = `<svg width="311" height="311" viewBox="0 0 311 311" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_198_311" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="311" height="311">
<path d="M176.709 155.5C191.051 118.901 206.645 68.9716 206.645 51.6611C206.645 23.1305 183.515 0 154.983 0C126.452 0 103.322 23.1305 103.322 51.6611C103.322 68.9716 118.915 118.901 133.257 155.5C118.915 192.099 103.322 242.028 103.322 259.339C103.322 287.87 126.452 311 154.983 311C183.515 311 206.645 287.87 206.645 259.339C206.645 242.028 191.051 192.099 176.709 155.5Z" fill="white"/>
<path d="M155.5 134.291C118.902 119.949 68.9714 104.355 51.6611 104.355C23.1295 104.355 0 127.485 0 156.017C0 184.548 23.1295 207.678 51.6611 207.678C68.9714 207.678 118.902 192.085 155.5 177.743C192.098 192.085 242.029 207.678 259.339 207.678C287.871 207.678 311 184.548 311 156.017C311 127.485 287.871 104.355 259.339 104.355C242.029 104.355 192.098 119.949 155.5 134.291Z" fill="white"/>
</mask>
<g mask="url(#mask0_198_311)">
<rect x="-155.5" y="-155.5" width="466.5" height="466.5" fill="#92E16A"/>
</g>
</svg>
`;

const svg_2 = `<svg width="639" height="345" viewBox="0 0 639 345" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M632.87 42.1812C627.912 2.97944 612.126 -38.0455 573.64 -60.9674C552.636 -73.4703 536.328 -76.3355 514.15 -74.7727C464.184 -71.647 437.961 -43.2551 419.957 -7.30923C415.261 1.9377 413.434 -0.537207 411.347 -7.70032C402.606 -39.0878 385.907 -69.3027 347.812 -77.2472C291.453 -88.8385 255.446 -63.1817 229.484 -12.3887C225.962 -5.48609 224.918 -2.88163 221.787 -11.0867C199.348 -71.6476 119.766 -70.2147 78.9319 -42.6042C15.3974 0.24431 -0.257731 95.7092 0.0031907 170.727C0.264113 238.19 22.3121 341.599 109.721 338.083C147.685 336.52 185.127 309.822 200.652 272.053C203.653 264.889 204.958 257.986 207.306 268.275C233.137 384.187 378.601 355.274 406.52 270.75C410.564 258.637 412.912 261.242 415.782 270.75C430.655 318.808 484.666 349.544 533.589 337.823C636.522 313.338 649.568 173.722 633 42.1812H632.87Z" fill="#99CEFF"/>
</svg>
`;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  root_id: "playground",
  nodes: {
    playground: {
      id: "playground",
      name: "playground",
      type: "container",
      active: true,
      locked: false,
      expanded: true,
      opacity: 1,
      zIndex: 0,
      position: "relative",
      style: {
        width: 960,
        height: 540,
        backgroundColor: { r: 0, g: 0, b: 0, a: 1 },
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      },
      children: ["card_1_bg", "card_2_bg", "card_3_bg"],
    },
    card_1_bg: {
      id: "card_1_bg",
      name: "card_1_bg",
      type: "image",
      active: true,
      locked: false,
      opacity: 1,
      zIndex: -1,
      width: 300,
      height: 510,
      position: "absolute",
      top: 15,
      left: 15,
      style: {
        width: 300,
        height: 510,
        backgroundColor: { r: 255, g: 255, b: 255, a: 0.1 },
      },
    },
    card_2_bg: {
      id: "card_2_bg",
      name: "card_2_bg",
      type: "image",
      active: true,
      locked: false,
      opacity: 1,
      zIndex: -1,
      width: 300,
      height: 510,
      position: "absolute",
      top: 15,
      left: 330,
      style: {
        width: 300,
        height: 510,
        backgroundColor: { r: 255, g: 255, b: 255, a: 0.1 },
      },
    },
    card_3_bg: {
      id: "card_3_bg",
      name: "card_3_bg",
      type: "image",
      active: true,
      locked: false,
      opacity: 1,
      zIndex: -1,
      width: 300,
      height: 510,
      position: "absolute",
      top: 15,
      left: 645,
      style: {
        width: 300,
        height: 510,
        backgroundColor: { r: 255, g: 255, b: 255, a: 0.1 },
      },
    },
  },
} satisfies grida.program.document.IDocumentDefinition;
