import Input from "../../form/input";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import styles from "../../form/Form.module.css";
import { Context } from "../../../context/userContext";




function Login() {


  const [user, setUser] = useState({});
  const {login} = useContext(Context);

  function handleChange(e) {
    setUser({...user, [e.target.name] : e.target.value});
  }

  function handleSubmit(e)
  {
    e.preventDefault();
    login(user);
  }

  return (
    <section className={styles.form_container}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <Input
          name="email"
          placeholder="Digite o seu e-mail"
          text="E-mail"
          handleOnChange={handleChange}
          type="email"
        />

        <Input
          name="password"
          placeholder="Digite sua senha"
          text="Senha"
          handleOnChange={handleChange}
          type="password"
        />

        <input type="submit" value="Entrar" />
        <p>
          Não tem conta? <Link to="/register">Clique Aqui.</Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
