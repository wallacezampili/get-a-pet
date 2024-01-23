import Input from "../../form/input";
import styles from "../../form/Form.module.css";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";

//Context
import { Context } from "../../../context/userContext";


function Register() {
  const [user, setUser] = useState({});
  const {register} = useContext(Context);



  const inputData = [
    {
      text: "Nome",
      type: "text",
      name: "name",
      placeholder: "Digite o seu nome",
    },
    {
      text: "Telefone",
      type: "text",
      name: "phone",
      placeholder: "Digite o seu telefone",
    },
    {
      text: "E-mail",
      type: "email",
      name: "email",
      placeholder: "Digite o seu e-mail",
    },
    {
      text: "Senha",
      type: "password",
      name: "password",
      placeholder: "Digite a sua senha",
    },
    {
      text: "Confirmação de Senha",
      type: "password",
      name: "confirmpassword",
      placeholder: "Confirme sua senha",
    },
  ];

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    //enviar para o banco
    register(user);



    console.log(user);
  }

  return (
    <section className={styles.form_container}>
      <h1>Registrar</h1>
      <form onSubmit={handleSubmit}>
        {inputData.map((input) => (
          <Input 
          key={input.name} 
          text={input.text}
          name={input.name}
          placeholder={input.placeholder}
          type={input.type}
          handleOnChange={handleChange} />
        ))}
        <input type="submit" value="Cadastrar"/>
      </form>
      <p>
        Já tem conta? <Link to="/login">Clique aqui.</Link>
      </p>
    </section>
  );
}

export default Register;
