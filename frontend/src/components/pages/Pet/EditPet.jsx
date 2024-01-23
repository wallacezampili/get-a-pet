import api from "../../../utils/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./AddPet";
import PetForm from "../../form/PetForm";

//hooks
import useFlashMessage from "../../../hooks/useFlashMessage";

function EditPet() {
  const { setFlashMessage } = useFlashMessage();
  const [pet, setPet] = useState({});
  const [token] = useState(localStorage.getItem("token") || "");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/pets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setPet(response.data.pet);
      });
  }, [id, token]);

  async function updatePet(pet) {
    let msgType = "success";
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
      .patch(`/pets/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        msgType = "error";
        return err.response.data;
      });

    setFlashMessage(data.message, msgType);
    navigate("/pet/mypets");
  }

  return (
    <section>
      <div className={styles.addpet_header}>
        <h1>Editando pet: {pet.name}</h1>
        <p>Depois da edição os dados serão atualizados no sistema.</p>
      </div>
      {pet.name && (
        <PetForm handleSubmit={updatePet} btnText="Atualizar" petData={pet} />
      )}
    </section>
  );
}

export default EditPet;
