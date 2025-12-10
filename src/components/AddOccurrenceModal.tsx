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
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [formData, setFormData] = useState({
    tipo: "",
    local: "",
    endereco: "",
    bairro: "",
    cidade: "Recife",
    estado: "PE",
    descricao: "",
    prioridade: "MEDIA",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    // Validação dos campos obrigatórios
    if (!formData.tipo || !formData.local || !formData.endereco) {
      setErro("Por favor, preencha os campos obrigatórios (Tipo, Local e Endereço)!");
      return;
    }

    setLoading(true);
    try {
      // Monta o endereço completo para o geocoding
      const enderecoCompleto = [
        formData.endereco,
        formData.bairro,
        formData.cidade,
        formData.estado
      ].filter(Boolean).join(", ");

      // NÃO envia latitude/longitude - deixa o backend fazer o geocoding!
      await addOccurrence({
        tipo: formData.tipo,
        local: formData.local,
        endereco: enderecoCompleto,
        descricao: formData.descricao,
        prioridade: formData.prioridade,
      });

      // Reset form
      setFormData({
        tipo: "",
        local: "",
        endereco: "",
        bairro: "",
        cidade: "Recife",
        estado: "PE",
        descricao: "",
        prioridade: "MEDIA",
      });

      onClose();
    } catch (error: any) {
      console.error("Erro ao criar ocorrência:", error);
      setErro(error.response?.data?.message || error.message || "Erro ao criar ocorrência. Verifique o endereço.");
    } finally {
      setLoading(false);
    }
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
          {erro && (
            <div style={{ 
              color: "#dc2626", 
              background: "#fef2f2", 
              padding: "12px", 
              borderRadius: "8px", 
              marginBottom: "16px",
              border: "1px solid #fecaca"
            }}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: "8px" }}></i>
              {erro}
            </div>
          )}

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
                <option value="RISCO">Risco</option>
                <option value="ALAGAMENTO">Alagamento</option>
                <option value="TRANSITO">Trânsito</option>
                <option value="INCENDIO">Incêndio</option>
                <option value="QUEDA_ARVORE">Queda de Árvore</option>
                <option value="ACIDENTE">Acidente</option>
                <option value="RESGATE">Resgate</option>
                <option value="VAZAMENTO">Vazamento</option>
                <option value="OUTROS">Outros</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="prioridade">Prioridade</label>
              <select
                id="prioridade"
                name="prioridade"
                value={formData.prioridade}
                onChange={handleChange}
              >
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
                <option value="CRITICA">Crítica</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="local">
              Local / Referência <span className="required">*</span>
            </label>
            <input
              type="text"
              id="local"
              name="local"
              value={formData.local}
              onChange={handleChange}
              placeholder="Ex: Praça do Derby, próximo ao semáforo"
              required
            />
            <small style={{ color: "#6b7280", fontSize: "0.8em" }}>
              Nome do local ou ponto de referência
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="endereco">
              Endereço Completo <span className="required">*</span>
            </label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              placeholder="Ex: Rua do Pombal, 57"
              required
            />
            <small style={{ color: "#6b7280", fontSize: "0.8em" }}>
              Rua e número para localização no mapa
            </small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bairro">Bairro</label>
              <input
                type="text"
                id="bairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                placeholder="Ex: Santo Amaro"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cidade">Cidade</label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                placeholder="Recife"
              />
            </div>
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
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Localizando endereço...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Registrar Ocorrência
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOccurrenceModal;