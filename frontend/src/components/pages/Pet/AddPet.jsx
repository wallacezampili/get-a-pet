import styles from "./AddPet.module.css";
import api from "../../../utils/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//Hooks
import useFlashMessage from "../../../hooks/useFlashMessage";
import PetForm from "../../form/PetForm";

function AddPet() {
  const [token] = useState(localStorage.getItem("token") || "");
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  async function registerPet(pet) {
    let mstType = "success";
    const formData = new FormData();
    await Object.keys(pet).forEach((key) => {
      if (key === "images") {
        for (let i = 0; i < pet[key].length; i++) {
          formData.append("images", pet[key][i]);
        }
      } else {
        formData.append(key, pet[key]);
      }
    });

    const data = await api
      .post("/pets/create", formData, {headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "multipart/form-data",
      }})
      .then((response) => {
        console.log(response.data)
        return response.data;
      })
      .catch((err) => {
        mstType = "error";
        return err.response.data;
      });
    console.log(data.message)
    setFlashMessage(data.message, mstType);
    if (mstType !== "error") {
      navigate("/pet/mypets");
    }
  }
  return (
    <section className={styles.addpet_header}>
      <div>
        <h1>Cadastre um Pet</h1>
        <p>Depois ele ficará disponível para adoção.</p>
      </div>
      <PetForm btnText="Cadastrar Pet" handleSubmit={registerPet} />
    </section>
  );
}

export default AddPet;
