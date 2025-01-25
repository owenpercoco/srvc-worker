import { useState, useEffect } from "react";

interface DeliveryMinimum {
  name: string;
  value: number;
}

export default function PageSettingsForm() {
  const [isTelegramLinkVisible, setIsTelegramLinkVisible] = useState(false);
  const [isPhoneNumberVisisble, setIsPhoneNumberVisisble] = useState(false);
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

      <div>
        <h3>Delivery Minimums</h3>
        {minimums.map((minimum, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Name"
              value={minimum.name}
              onChange={(e) => handleMinimumChange(index, "name", e.target.value)}
              style={{ marginRight: "1rem" }}
            />
            <input
              type="number"
              placeholder="Value"
              value={minimum.value}
              onChange={(e) => handleMinimumChange(index, "value", parseFloat(e.target.value))}
              style={{ marginRight: "1rem" }}
            />
            <button type="button" onClick={() => removeMinimum(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addMinimum}>
          Add Minimum
        </button>
      </div>

      <button type="submit">Save Settings</button>
    </form>
  );
}
