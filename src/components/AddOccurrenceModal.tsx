import React, { useState } from "react";
import { useOccurrences } from "../components/OccurrencesContext";
import { geocodeAddress } from "../utils/mapUtils"; // Usa a função centralizada
import "../styles/Dashboard.css";

interface AddOccurrenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddOccurrenceModal: React.FC<AddOccurrenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addOccurrence } = useOccurrences();
  const [isSearching, setIsSearching] = useState(false);

  const [formData, setFormData] = useState({
    tipo: "",
    local: "",
    status: "Novo" as "Novo" | "Em Análise" | "Concluído",
    descricao: "",
    responsavel: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tipo || !formData.local) {
      alert("Por favor, preencha os campos obrigatórios!");
      return;
    }

    setIsSearching(true);

    // 1. Busca coordenadas reais
    const coords = await geocodeAddress(formData.local);

    // 2. Se falhar, usa padrão (Centro Recife) e avisa
    const finalLat = coords ? coords.lat : -8.0476;
    const finalLng = coords ? coords.lng : -34.8770;

    if (!coords) {
      alert("Endereço não encontrado com precisão. Salvando no centro de Recife.");
    }

    // 3. Salva
    addOccurrence({
      ...formData,
      latitude: finalLat,
      longitude: finalLng,
      data: "Agora",
    });

    setIsSearching(false);

    // Reset
    setFormData({
      tipo: "",
      local: "",
      status: "Novo",
      descricao: "",
      responsavel: "",
    });

    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-plus-circle"></i>
            Registrar Nova Ocorrência
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tipo">Tipo <span className="required">*</span></label>
              <select id="tipo" name="tipo" value={formData.tipo} onChange={handleChange} required>
                <option value="">Selecione...</option>
                <option value="Risco">Risco</option>
                <option value="Alagamento">Alagamento</option>
                <option value="Trânsito">Trânsito</option>
                <option value="Incêndio">Incêndio</option>
                <option value="Queda de Árvore">Queda de Árvore</option>
                <option value="Acidente">Acidente</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange}>
                <option value="Novo">Novo</option>
                <option value="Em Análise">Em Análise</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="local">Local <span className="required">*</span></label>
            <input type="text" id="local" name="local" value={formData.local} onChange={handleChange} placeholder="Ex: Av. Boa Viagem, 1500" required />
          </div>

          <div className="form-group">
            <label htmlFor="responsavel">Responsável</label>
            <input type="text" id="responsavel" name="responsavel" value={formData.responsavel} onChange={handleChange} placeholder="Nome do responsável" />
          </div>

          <div className="form-group">
            <label htmlFor="descricao">Descrição</label>
            <textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} placeholder="Detalhes..." rows={4} />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSearching}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={isSearching}>
              <i className={isSearching ? "fas fa-spinner fa-spin" : "fas fa-save"}></i>
              {isSearching ? " Buscando..." : " Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOccurrenceModal;