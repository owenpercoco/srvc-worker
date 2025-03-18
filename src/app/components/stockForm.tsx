import { MouseEvent } from 'react';
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export function StockToggle({ isInStock, onChange } : { isInStock?: boolean, onChange: any}) {
  return (
    <ToggleButtonGroup
      value={isInStock}
      exclusive
      onChange={(e: MouseEvent, value: string) => {
        if (value === "is_in_stock") {
            onChange(true)
        } else if (value === "out_of_stock") {
            onChange(false);
        } else {
            console.error("malformed value in form")
        }
      }}
      className="rounded-lg p-1"
    >
     <ToggleButton
        value="is_in_stock"
        selected={isInStock}
        className="w-24 !rounded-l-lg !border !border-gray-400 transition-all"
        sx={{
          backgroundColor: isInStock ? "#22c55e" : "#d1d5db",
          boxShadow: isInStock ? "0px 0px 10px #22c55e" : "none",
          "&:not(.Mui-selected)": { opacity: 0.6 }
        }}
      >
        ✅
      </ToggleButton>
      <ToggleButton
        value="out_of_stock"
        selected={!isInStock}
        className="w-24 !rounded-r-lg !border !border-gray-400 transition-all"
        sx={{
          backgroundColor: !isInStock ? "#ef4444" : "#d1d5db",
          boxShadow: !isInStock ? "0px 0px 10px #ef4444" : "none",
          "&:not(.Mui-selected)": { opacity: 0.6 }
        }}
      >
        ❌
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
