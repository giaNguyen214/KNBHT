// import MultiColorPicker from "@/components/utils/ColorPicker";

// export default function Page() {
//   return <MultiColorPicker />;
// }

// "use client"
// import { useState } from "react";
// import { MuiColorInput } from "mui-color-input";
// import { Box, Chip } from "@mui/material";

// export default function MultiColorInput() {
//   const [colors, setColors] = useState<string[]>([]);

//   const handleAddColor = (color: string) => {
//     if (!colors.includes(color)) {
//       setColors([...colors, color]);
//     }
//   };

//   const removeColor = (c: string) => {
//     setColors(colors.filter(col => col !== c));
//   };

//   return (
//     <Box>
//       <MuiColorInput value="" onChange={handleAddColor} />
//       <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
//         {colors.map(c => (
//           <Chip
//             key={c}
//             label={c}
//             sx={{ backgroundColor: c, color: "#fff" }}
//             onDelete={() => removeColor(c)}
//           />
//         ))}
//       </Box>
//     </Box>
//   );
// }
