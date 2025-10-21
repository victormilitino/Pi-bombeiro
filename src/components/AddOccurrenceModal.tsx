import React, { useState } from "react";
import { useOccurrences } from "../components/OccurrencesContext";
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

  const [formData, setFormData] = useState({
    tipo: "",
    local: "",
    status: "Novo" as "Novo" | "Em Análise" | "Concluído",
    descricao: "",
    responsavel: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tipo || !formData.local) {
      alert("Por favor, preencha os campos obrigatórios!");
      return;
    }

    addOccurrence({
      ...formData,
      data: "Agora",
    });

    // Reset form
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
              <label htmlFor="tipo">
                Tipo de Ocorrência <span className="required">*</span>
              </label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
              >
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
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Novo">Novo</option>
                <option value="Em Análise">Em Análise</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="local">
              Local <span className="required">*</span>
            </label>
            <input
              type="text"
              id="local"
              name="local"
              value={formData.local}
              onChange={handleChange}
              placeholder="Ex: Rua Principal, 123"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="responsavel">Responsável</label>
            <input
              type="text"
              id="responsavel"
              name="responsavel"
              value={formData.responsavel}
              onChange={handleChange}
              placeholder="Nome do responsável"
            />
          </div>

          <div className="form-group">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva os detalhes da ocorrência..."
              rows={4}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              <i className="fas fa-save"></i>
              Registrar Ocorrência
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOccurrenceModal;
