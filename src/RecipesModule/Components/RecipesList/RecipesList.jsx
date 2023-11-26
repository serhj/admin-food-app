import React, { useEffect, useState } from "react";
import Header from "../../../SharedModule/Components/Header/Header";
import headerImg from "../../../assets/images/head1.png";
import NoData from "../../../SharedModule/Components/NoData/NoData";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import noData from "../../../assets/images/nodata.png";
import recipeAlt from "../../../assets/images/recipe.png";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

export default function RecipesList() {
  let [recipesList, setRecipesList] = useState([]);
  let [itemId, setItemId] = useState(0);
  let [categoriesList, setCategoriesList] = useState([]);
  let [tagList, setTagList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  //*****************validation using useform***********************
  let {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  // **********to use more than one modal in same component**********
  const [modalState, setModalState] = useState("close");

  const showAddModal = () => {
    reset();
    setValue("tagId",null)
    setValue("categoriesIds",null)
    setValue("recipeImage",null)
    setModalState("add-modal");
  };

  const showDeleteModal = (id) => {
    setItemId(id);
    setModalState("delete-modal");
  };
  //  const showUpdateModal = (categoryObj) => {
  //    setItemId(categoryObj.id);
  //    setValue("name",categoryObj.name)
  //    setModalState("update-modal");
  //  };
  const handleClose = () => setModalState("close");

  //************* to get categories list *******************
  const getCategoryList = () => {
    //get categ
    axios
      .get(
        "http://upskilling-egypt.com:3002/api/v1/Category/?pageSize=10&pageNumber=1",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then((response) => {
        setCategoriesList(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          error?.response?.data?.message ||
            "An error occurred. Please try again.",
          {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          }
        );
      });
  };
  //************to get all tags*************************
  const getAllTags = () => {
    //get tags
    axios
      .get("http://upskilling-egypt.com:3002/api/v1/tag/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        setTagList(response?.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          error?.response?.data?.message ||
            "An error occurred. Please try again.",
          {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          }
        );
      });
  };

  //****************upload image function********************
  const handleImageChange = (e) => {
    console.log(e.target.files[0]);
    setSelectedImage(e.target.files[0]);
    setValue("recipeImage",e.target.files[0])
  };
  //****************delete Recipe****************************
  const deleteRecipe = () => {
    axios
      .delete(`http://upskilling-egypt.com:3002/api/v1/Recipe/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        console.log(response);
        handleClose();
        getAllRecipes();
        toast.success(
          response?.data?.message || "Recipe deleted successfully",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          error?.response?.data?.message ||
            "An error occurred. Please try again.",
          {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          }
        );
      });
  };

  //****************get all Recipe****************************
  const getAllRecipes = () => {
    axios
      .get(
        "http://upskilling-egypt.com:3002/api/v1/Recipe/?pageSize=10&pageNumber=1",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )
      .then((response) => {
        setRecipesList(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          error?.response?.data?.message ||
            "An error occurred. Please try again.",
          {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          }
        );
      });
  };
  //****************add new Recipe****************************
  const onSubmit = (data) => {
    console.log("add recipe obj", data);
    axios
      .post(
        "http://upskilling-egypt.com:3002/api/v1/Recipe/",
        { ...data, recipeImage: data.recipeImage[0] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
       
        console.log(response);
        handleClose();
        getAllRecipes();
        toast.success(response?.data?.message || "Recipe added successfully", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        
      
      })
      .catch((error) => {
        console.log(response);
        
        toast.error(
          error?.response?.data?.message ||
            "An error occurred. Please try again.",
          {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          }
        );
        
      });
  };

  useEffect(() => {
    getCategoryList();
    getAllTags();
  }, []);
  useEffect(() => {
    getAllRecipes();
  });
  return (
    <>
      <Header>
        <div className="header-content text-white rounded">
          <div className="row align-items-center  m-2 p-3">
            <div className="col-md-10">
              <h3>Recipes Items</h3>
              <p className="w-75">
                You can now add your items that any user can order it from the
                Application and you can edit
              </p>
            </div>
            <div className="col-md-2">
              <div>
                <img src={headerImg} className="img-fluid" alt="header" />
              </div>
            </div>
          </div>
        </div>
      </Header>
      <div className="row justify-content-between mx-4 p-3 ">
        <div className="col-md-6 px-4">
          <h6>Recipes Table Details</h6>
          <p>You can check all details</p>
        </div>
        <div className="col-md-6 text-end">
          <button onClick={showAddModal} className="btn btn-success">
            Add new Recipe
          </button>
        </div>
        <div></div>
        {/* ******************** add modal ***************************/}
        <Modal show={modalState == "add-modal"} onHide={handleClose}>
          <Modal.Header closeButton>
            <h3>Add New Recipe</h3>
          </Modal.Header>
          <Modal.Body>
            <p>Welcome Back! Please enter your details</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter Recipe name"
                  {...register("name", { required: true })}
                />
                {errors.name && errors.name.type === "required" && (
                  <span className="m-2 text-danger">field is required</span>
                )}
              </div>
              <label>Tag</label>
              <select
                className="form-select"
                aria-label="Default select example"
                {...register("tagId", { required: true })}
              >
                {tagList?.map((tag) => (
                  <option key={tag?.id} value={tag?.id}>
                    {tag?.name}
                  </option>
                ))}
              </select>

              {errors.tagId && errors.tagId.type === "required" && (
                <span className="m-2 text-danger">field is required</span>
              )}

              <label>Category</label>
              <select
                className="form-select my-1"
                aria-label="Default select example"
                {...register("categoriesIds")}
              >
                {categoriesList.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.id}
                  </option>
                ))}
              </select>

              <div className="form-group">
                <input
                  className="form-control my-2"
                  type="number"
                  placeholder="Price"
                  {...register("price", { required: true })}
                />
                {errors.price && errors.price.type === "required" && (
                  <span className="m-2 text-danger">field is required</span>
                )}
              </div>

              <div className="form-group">
                <textarea
                  className="form-control"
                  placeholder="description"
                  id="w3review"
                  name="w3review"
                  rows="4"
                  cols="50"
                  {...register("description", { required: true })}
                ></textarea>
                {errors.description &&
                  errors.description.type === "required" && (
                    <span className="m-2 text-danger">field is required</span>
                  )}
              </div>

              <div className="form-group ">
                <input
                  type="file"
                  className="form-control my-1 "
                  id="customFile"
                  {...register("recipeImage")}
                  onChange={handleImageChange}
                />
            
                {selectedImage && (
                  <div>
                    <img
                      alt="not found"
                      width={"50px"}
                      src={URL.createObjectURL(selectedImage)}
                    />
                
                  </div>
                )}
              </div>

              <div className="text-end">
                <button  className="btn btn-success  my-3">Add Recipe</button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
        {/* //*****************add modal******************** */}
        {/* **************** * delete modal *****************/}
        <Modal show={modalState == "delete-modal"} onHide={handleClose}>
          <Modal.Header closeButton>
            <h3>delete this Recipe?</h3>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <img src={noData} />
              <p>
                are you sure you want to delete this item ? if you are sure just
                click on delete it
              </p>
            </div>
            <div className="text-end">
              <button
                onClick={deleteRecipe}
                className="btn btn-outline-danger  my-3"
              >
                Delete this item
              </button>
            </div>
          </Modal.Body>
        </Modal>
        {/************************* * //delete modal*************** */}
        {recipesList?.length > 0 ? (
          <table className="table">
            <thead className="table-head">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Recipe Name</th>
                <th scope="col">image</th>
                <th scope="col">price</th>
                <th scope="col">description</th>
                <th scope="col">Category</th>
                <th scope="col">Tag</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipesList.map((recipe) => (
                <tr key={recipe?.id}>
                  <th scope="row">{recipe?.id}</th>
                  <td>{recipe?.name}</td>
                  <td>
                    <div className="rec-image-container">
                      {recipe.imagePath ? (
                        <img
                          className="w-100"
                          src={
                            `http://upskilling-egypt.com:3002/` +
                            recipe?.imagePath
                          }
                        />
                      ) : (
                        <img className="w-100" src={recipeAlt} />
                      )}
                    </div>
                  </td>
                  <td>{recipe?.price}</td>
                  <td className="w-25">{recipe?.description}</td>
                  <td>{recipe?.category[0]?.name}</td>
                  <td>{recipe?.tag?.name}</td>
                  <td>
                    <i
                      // onClick={() => showUpdateModal(category)}
                      className="fa fa-edit fa-2x text-warning px-2"
                    ></i>
                    <i
                      onClick={() => showDeleteModal(recipe.id)}
                      className="fa fa-trash fa-2x text-danger"
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoData />
        )}
      </div>
    </>
  );
}
