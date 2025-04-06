import * as Dialog from "@radix-ui/react-dialog";
import { FaCross } from "react-icons/fa"
import "./filterModalStyle.css";

const FilterModal = () => (
  <>

    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
        <Dialog.Title className="DialogTitle">Filtrar Viagens</Dialog.Title>
        <div className="container-filter">
          <p>Meio de transporte:</p>
          <label>
            <input type="checkbox" name="transportMethod" />
            Avião
          </label>
          <label>
            <input type="checkbox" name="transportMethod" />
            Trem
          </label>
          <label>
            <input type="checkbox" name="transportMethod" />
            Caminhão
          </label>
          <label>
            <input type="checkbox" name="transportMethod" />
            Navio
          </label>
        </div>
        <div
          style={{ display: "flex", marginTop: 25, justifyContent: "flex-end" }}
        >
          <Dialog.Close asChild>
            <button className="Button green">Save changes</button>
          </Dialog.Close>
        </div>
        <Dialog.Close asChild>
          <button className="IconButton" aria-label="Close">
            <FaCross />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </>
);

export default FilterModal;
