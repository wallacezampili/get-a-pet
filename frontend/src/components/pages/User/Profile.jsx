import styles from "./Profile.module.css";
import formstyles from "../../form/Form.module.css";
import Input from "../../form/input";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import useFlashMessage from "../../../hooks/useFlashMessage";
import RoundedImage from "../../layout/RoundedImage";

function Profile() {
  const [user, setUser] = useState({});
  const [preview, setPreview] = useState("");
  const [token] = useState(localStorage.getItem("token") || "");
  const { setFlashMessage } = useFlashMessage();

  const inputData = [
    {
      text: "Imagem",
      type: "file",
      name: "image",
      handleOnChange: onFileChange,
    },
    {
      text: "E-mail",
      type: "email",
      name: "email",
      handleOnChange: handleChange,
      placeholder: "Digite seu e-mail.",
      value: user.email || "",
    },
    {
      text: "Nome",
      type: "text",
      name: "name",
      handleOnChange: handleChange,
      placeholder: "Digite seu nome.",
      value: user.name || "",
    },
    {
      text: "Telefone",
      type: "text",
      name: "phone",
      handleOnChange: handleChange,
      placeholder: "Digite seu telefone.",
      value: user.phone || "",
    },
    {
      text: "Senha",
      type: "password",
      name: "password",
      handleOnChange: handleChange,
      placeholder: "Digite sua senha.",
    },
    {
      text: "Confirmação de Senha",
      type: "password",
      name: "confirmpassword",
      handleOnChange: handleChange,
      placeholder: "Confirme sua senha.",
    },
  ];

  useEffect(() => {
    api
      .get("/users/checkuser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((responde) => {
        setUser(responde.data);
      });
  }, [token]);

  function onFileChange(e) {
    setPreview(e.target.files[0]);
    setUser({ ...user, [e.target.name]: e.target.files[0] });
  }

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let msgType = "success";

    const formData = new FormData();

    await Object.keys(user).forEach((key) => {
      formData.append(key, user[key]);
    });

    const data = await api
      .patch(`/users/edit/${user._id}`, formData, {
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

    api.patch("/user/");
  }

  return (
    <section>
      <div className={styles.profile_header}>
        <h1>Profile</h1>
        {(user.image || preview) && (
          <RoundedImage
            src={
              preview
                ? URL.createObjectURL(preview)
                : /*`${process.env.REACT_APP_API}*/ `http://localhost:5000/images/users/${user.image}`
            }
            alt={user.name}
          />
        )}
      </div>
      <form onSubmit={handleSubmit} className={formstyles.form_container}>
        {inputData.map((input) => {
          return (
            <Input
              key={input.name}
              name={input.name}
              type={input.type}
              handleOnChange={input.handleOnChange}
              placeholder={input.placeholder}
              text={input.text}
              value={input.value}
            />
          );
        })}

        <input type="submit" value="Editar" onSubmit={handleSubmit} />
      </form>
    </section>
  );
}

export default Profile;
