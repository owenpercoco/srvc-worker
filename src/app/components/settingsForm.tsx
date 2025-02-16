import { useState, useEffect } from "react";
import { TextField, InputAdornment, Grid, Button, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

interface DeliveryMinimum {
  name: string;
  value: number;
}

export default function PageSettingsForm() {
  const [isTelegramLinkVisible, setIsTelegramLinkVisible] = useState(false);
  const [isPhoneNumberVisisble, setIsPhoneNumberVisisble] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [minimums, setMinimums] = useState<DeliveryMinimum[]>([]);

  useEffect(() => {
    async function fetchSettings() {
      const settings = await fetch('api/settings');
      const settingsResult = await settings.json()
      console.log(settingsResult)
      setIsTelegramLinkVisible(settingsResult.data.isTelegramLinkVisible);
      setIsPhoneNumberVisisble(settingsResult.data.isPhoneNumberVisisble);
      setMinimums(settingsResult.data.minimums);
    }

    fetchSettings();
  }, []);

  const handleMinimumChange = (index: number, field: string, value: string | number) => {
    const updatedMinimums: any[] = [...minimums];
    updatedMinimums[index][field as keyof DeliveryMinimum] = value;
    setMinimums(updatedMinimums);
  };

  const addMinimum = () => {
    setMinimums([...minimums, { name: "", value: 0 }]);
  };

  const removeMinimum = (index: number) => {
    const updatedMinimums = minimums.filter((_, i) => i !== index);
    setMinimums(updatedMinimums);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      isTelegramLinkVisible,
      isPhoneNumberVisisble,
      minimums,
    };
    console.log(payload)
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Settings saved successfully");
      } else {
        const error = await response.json();
        console.error("Error saving settings:", error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <>
    <button
    className="open-settings-button"
    onClick={() => setIsExpanded(!isExpanded)}
  >
    ⚙
  </button>
      <div className={`settings-bar ${isExpanded ? 'expanded' : ''}`}>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="checkbox"
              checked={isTelegramLinkVisible}
              onChange={(e) => setIsTelegramLinkVisible(e.target.checked)}
            />
            Display Telegram Section
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={isPhoneNumberVisisble}
              onChange={(e) => setIsPhoneNumberVisisble(e.target.checked)}
            />
            Display Phone Number
          </label>
        </div>

        <div className="mb-4">
          <h3 className="mt-4">Delivery Minimums</h3>
          {minimums.map((minimum, index) => (
            <Grid container className="mb-4" key={index}>
              <Grid item xs={10}>
                <Grid container>
                  <Grid item xs={2}>
                  <div className="relative">
                      <span className="text-sm text-zinc-800">Area</span>
                    </div>
                  </Grid>
                  <Grid item xs={10} className="mb-1">
                  <TextField
                    type="text"
                    value={minimum.name}
                    onChange={(e) => handleMinimumChange(index, "name", e.target.value)}
                    className="w-full text-sm"
                    InputProps={{
                    className: "text-center text-base h-7 text-sm bg-white border border-gray-300 rounded-md", // Centers text
                    }}
                  />
                  </Grid>
                  <Grid item xs={6}>
                    <div className="relative">
                      <span className="text-sm text-zinc-800">Delivery Minimum</span>
                    </div>
                  </Grid>
                  <Grid item xs={6} sm={6}>
                  <TextField
                    type="number"
                    placeholder="Value"
                    value={minimum.value}
                    onChange={(e) => handleMinimumChange(index, "value", parseFloat(e.target.value))}
                    className="w-20 text-sm"
                    InputProps={{
                    className: "text-center text-base h-7 text-sm bg-white border border-gray-300 rounded-md", // Centers text
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                  </Grid>
                </Grid>
                </Grid>
                <Grid item xs={1}>
                  <IconButton aria-label="delete" onClick={() => removeMinimum(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
            </Grid>
          ))}
          <Button variant="outlined" size="small" type="button" onClick={addMinimum}>
            Add Minimum
          </Button>
        </div>

        <Button variant="contained" size="small" type="submit">Save Settings</Button>
      </form>
    </div>
    </>
  );
}
