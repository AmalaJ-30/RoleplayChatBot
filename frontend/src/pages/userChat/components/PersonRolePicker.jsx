import React, { useState } from "react";

function PersonRolePicker({ person, setPerson, role, setRole, famousPeople, roles }) {
  const [suggestions, setSuggestions] = useState([]);

  const handlePersonChange = (e) => {
    const value = e.target.value;
    setPerson(value);

    setSuggestions(
      value.trim().length === 0
        ? []
        : famousPeople.filter(name =>
            name.toLowerCase().includes(value.toLowerCase())
          )
    );
  };

  return (
    <div>
      {/* Famous Person Input with Suggestions */}
      <div>
        <input
          type="text"
          value={person}
          onChange={handlePersonChange}
          placeholder="Enter a famous person"
        />
        {suggestions.length > 0 && (
          <ul>
            {suggestions.map((name, i) => (
              <li
                key={i}
                onClick={() => {
                  setPerson(name);
                  setSuggestions([]);
                }}
              >
                {name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Fixed Roles Dropdown */}
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">-- Select a role --</option>
        {roles.map((r, i) => (
          <option key={i} value={r}>
            {r}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PersonRolePicker;
