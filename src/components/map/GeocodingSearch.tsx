import React from "react";

interface GeocodingSearchProps {
  searchAddress: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

const GeocodingSearch: React.FC<GeocodingSearchProps> = ({
  searchAddress,
  onSearchChange,
  onSearch,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="geocoding-search">
      <div className="search-input-group">
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Digite um endereço (ex: Av. Boa Viagem, Recife - PE)"
          value={searchAddress}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={onSearch}>
          <i className="fas fa-map-marker-alt"></i>
          Buscar
        </button>
      </div>
      <p className="search-hint">
        <i className="fas fa-lightbulb"></i>
        Busque por endereços em Pernambuco (ex: Av. Boa Viagem, Recife)
      </p>
    </div>
  );
};

export default GeocodingSearch;