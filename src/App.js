import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const options = [
    { value: "numbers", label: "Numbers" },
    { value: "alphabets", label: "Alphabets" },
    { value: "highest_lowercase_alphabet", label: "Highest Lowercase Alphabet" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Parse JSON input
      const data = JSON.parse(jsonInput);

      // Call the backend API (replace with your actual endpoint URL)
      const res = await axios.post("https://your-backend-api.com/bfhl", {
        data: data.data,
        file_b64: data.file_b64 || ""
      });

      setResponse(res.data);
    } catch (err) {
      setError("Invalid JSON or API error");
    } finally {
      setLoading(false);
    }
  };

  const renderFilteredData = () => {
    if (!response) return null;

    const selectedData = {};
    selectedOptions.forEach((option) => {
      selectedData[option.value] = response[option.value];
    });

    return (
      <div>
        {Object.entries(selectedData).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong>
            <pre>{JSON.stringify(value, null, 2)}</pre>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>MP Health Dev Challenge Frontend</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            placeholder="Enter JSON input"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows="10"
            cols="50"
          />
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div>
          <Select
            isMulti
            name="select-options"
            options={options}
            value={selectedOptions}
            onChange={setSelectedOptions}
            placeholder="Select fields to display"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>

      {response && (
        <div>
          <h2>Response</h2>
          {renderFilteredData()}
        </div>
      )}
    </div>
  );
}

export default App;