import { useState } from "react";

interface DeliveryMinimum {
  name: string;
  value: number;
}

interface PageSettingsFormProps {
  initialData?: {
    isTelegramLinkVisible: boolean;
    isPhoneNumberVisisble: boolean;
    minimums: DeliveryMinimum[];
  };
  onSubmit: (data: {
    isTelegramLinkVisible: boolean;
    isPhoneNumberVisisble: boolean;
    minimums: DeliveryMinimum[];
  }) => void;
}

export default function PageSettingsForm({ initialData, onSubmit }: PageSettingsFormProps) {
  const [telegramLink, setTelegramLink] = useState(initialData?.isTelegramLinkVisible || false);
  const [phoneNumber, setPhoneNumber] = useState(initialData?.isPhoneNumberVisisble || false);
  const [minimums, setMinimums] = useState<DeliveryMinimum[]>(
    initialData?.minimums || [{ name: "", value: 0 }]
  );

  const handleMinimumChange = (index: number, field: keyof DeliveryMinimum, value: string | number) => {
    const updatedMinimums = [...minimums];
    updatedMinimums[index][field] = value as never;
    setMinimums(updatedMinimums);
  };

  const addMinimum = () => {
    setMinimums([...minimums, { name: "", value: 0 }]);
  };

  const removeMinimum = (index: number) => {
    const updatedMinimums = minimums.filter((_, i) => i !== index);
    setMinimums(updatedMinimums);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ telegramLink, phoneNumber, minimums });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <input
            type="checkbox"
            checked={telegramLink}
            onChange={(e) => setTelegramLink(e.target.checked)}
          />
          Telegram Link
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.checked)}
          />
          Phone Number
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
