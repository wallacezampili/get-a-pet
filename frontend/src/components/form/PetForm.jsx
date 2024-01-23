import { useState } from "react";
import formStyles from "./Form.module.css";
import Input from "./input";
import Select from "./Select";
function PetForm({ handleSubmit, petData, btnText }) {
  const [pet, setPet] = useState(petData || {});
  const [preview, setPreview] = useState([]);
  const colors = ["Branco", "Preto", "Cinza", "Caramelo", "Mesclado"];
  const inputData = [
    {
      text: "Imagens do Pet",
      type: "file",
      name: "images",
      handleOnChange: onFileChange ,
      multiple: true,
    },
    {
      text: "Nome",
      type: "text",
      name: "name",
      placeholder: "Digite o nome",
      handleOnChange: handleChange ,
      value: pet.name || "",
    },
    {
      text: "Idade",
      type: "text",
      name: "age",
      placeholder: "Digite a idade",
      handleOnChange: handleChange ,
      value: pet.age || "",
    },
    {
      text: "Peso do pet",
      type: "number",
      name: "weight",
      placeholder: "Digite o peso do pet",
      handleOnChange: handleChange ,
      value: pet.weight || "",
    },
  ];

  function handleChange(e) {

    setPet({ ...pet, [e.target.name]: e.target.value });
  
  
  }
  function onFileChange(e) {
  
    setPreview(Array.from(e.target.files));
    setPet({ ...pet, images: [...e.target.files] });
  
  }
  function handleColor(e) {
  
    setPet({ ...pet, color: e.target.options[e.target.selectedIndex].text });
  
  }
  
  function submit(e)
  {
    e.preventDefault();
    console.log(pet);
    handleSubmit(pet);
  }
  
  return (
    <form className={formStyles.form_container} onSubmit={submit}>

      <div className={formStyles.preview_pet_images}>
        {
          preview.length > 0 ? 
          preview.map((image, index) => (
            <img src={URL.createObjectURL(image)} alt={pet.name} key={`${pet.name}${index}`}/>
          )) :
          pet.images && 
          pet.images.map((image, index) => (
            <img src={`http://localhost:5000/images/pets/${image}`} alt={pet.name} key={`${pet.name}${index}`}/>
          ))
        }
      </div>


      {inputData.map((input) => {
        return (
          
          <Input
            key={input.name}
            name={input.name}
            text={input.text}
            handleOnChange={input.handleOnChange}
            value={input.value}
            type={input.type}
            placeholder={input.placeholder}
            multiple={input.multiple}
          />
        );
      })}
      <Select
        name="color"
        text="Selecione a cor"
        options={colors}
        handleOnChange={handleColor}
        value={pet.color}
      />
      <input type="submit" value={btnText} />
    </form>
  );
}

export default PetForm;
