import React from "react";
import { FaSearch } from "react-icons/fa";
import "../../css/componentes/Comunes/SearchBar.css";

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="search-bar">
      <FaSearch className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
