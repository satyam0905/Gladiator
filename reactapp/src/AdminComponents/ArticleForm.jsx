


// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import "./ArticleForm.css";
// import axios from "axios";
// import API_BASE_URL from "../apiConfig";
// import AdminNavbar from "./AdminNavbar";
// import UserNavbar from "../UserComponents/UserNavbar";

// const ArticleForm = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const params = useParams();
//   const storedUser = JSON.parse(localStorage.getItem("userData"));

//   const editData = location.state || null;
//   const routeId = params.id;

//   const isEdit = !!routeId || !!editData;


//   const [initialSnapshot, setInitialSnapshot] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState({});

//   const [form, setForm] = useState({
//     title: "",
//     category: "",
//     author: "",
//     content: "",
//     image: null, 
//     imageUrl: "", 
//   });

//   const token = storedUser.token;
  

//   const getHeaders = () => (token ? { Authorization: `Bearer ${token}` } : {});

//   const fileToBase64 = (file) =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });

//   const norm = (v) => (v == null ? "" : String(v)).trim();

//   const buildSnapshot = (f) => ({
//     title: norm(f.title),
//     category: norm(f.category),
//     author: norm(f.author),
//     content: norm(f.content),
//     imageUrl: norm(f.imageUrl),
//   });

//   const isSameSnapshot = (a, b) => JSON.stringify(a) === JSON.stringify(b);

//   useEffect(() => {
//     if (editData) {
//       const nextForm = {
//         title: editData.title ?? editData.Title ?? "",
//         category: editData.category ?? editData.Category ?? "",
//         author: editData.author ?? editData.Author ?? "",
//         content: editData.content ?? editData.Content ?? "",
//         image: null,
//         imageUrl: editData.articleImage ?? editData.ArticleImage ?? editData.image ?? "",
//       };

//       setForm(nextForm);
//       setInitialSnapshot(buildSnapshot(nextForm));
//       return;
//     }

//     if (routeId) {
//       axios
//         .get(`${API_BASE_URL}/api/articles/${routeId}`, { headers: getHeaders() })
//         .then((res) => {
//           const a = res.data;

//           const nextForm = {
//             title: a.title ?? a.Title ?? "",
//             category: a.category ?? a.Category ?? "",
//             author: a.author ?? a.Author ?? "",
//             content: a.content ?? a.Content ?? "",
//             image: null,
//             imageUrl: a.articleImage ?? a.ArticleImage ?? a.image ?? "",
//           };

//           setForm(nextForm);
//           setInitialSnapshot(buildSnapshot(nextForm));
//         })
//         .catch(console.error);
//     }
//   }, [editData, routeId]);

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setForm((prev) => ({ ...prev, [id]: value }));
//   };

//   const validate = () => {
//     const temperr = {};

//     if (form.title.trim() === "") temperr.title = "Title is required";
//     if (form.category.trim() === "") temperr.category = "Category is required";
//     if (form.author.trim() === "") temperr.author = "Author is required";
//     if (form.content.trim() === "") temperr.content = "Content is required";

//     if (!isEdit && form.image === null) temperr.image = "Image is required";
//     if (isEdit && !form.image && !form.imageUrl) temperr.image = "Image is required";

//     setError(temperr);
//     return Object.keys(temperr).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     if (isEdit && initialSnapshot) {
//       const currentSnapshot = buildSnapshot(form);
//       const noTextChanges = isSameSnapshot(currentSnapshot, initialSnapshot);
//       const noNewImagePicked = !form.image;

//       if (noTextChanges && noNewImagePicked) {
//         setMessage("No changes made (update will not work).");
//         setShowModal(true);
//         return; 
//       }
//     }

//     try {
//       let articleImageString = form.imageUrl;
//       if (form.image) {
//         articleImageString = await fileToBase64(form.image);
//       }

//       const payload = {
//         ArticleId: isEdit ? Number(routeId) : 0,
//         Title: form.title,
//         Category: form.category,
//         Content: form.content,
//         Author: form.author,
//         ArticleImage: articleImageString,
//       };

//       if (isEdit) {
//         await axios.put(`${API_BASE_URL}/api/articles/${routeId}`, payload, {
//           headers: getHeaders(),
//         });
//         setMessage("Article updated successfully!");
//       } else {
//         await axios.post(`${API_BASE_URL}/api/articles`, payload, {
//           headers: getHeaders(),
//         });
//         setMessage("Article added successfully!");
//       }

//       setShowModal(true);
//     } catch (err) {
//       console.error(err);
//       setMessage("Oops! Something went wrong.");
//       setShowModal(true);
//     }
//   };

//   const handleClose = () => {
//     setShowModal(false);

   
//     if (message === "No changes made.") return;

//     navigate("/view");
//   };

//   return (
//     <>
//       {storedUser?.role === "Admin" ? <AdminNavbar /> : <UserNavbar />}

//       <form className="article-form" onSubmit={handleSubmit}>
//         <fieldset className="form-container">
//           <div className="top-row">
//             <button type="button" className="back-btn" onClick={() => navigate(-1)}>
//               Back
//             </button>

//             <h2 className="form-title">{isEdit ? "Edit Article" : "Create New Article"}</h2>
//           </div>

//           <div className="form-input">
//             <label htmlFor="title">Title</label>
//             <input
//               className="form-input-field"
//               id="title"
//               type="text"
//               value={form.title}
//               onChange={handleChange}
//               required
//             />
//             {error.title && <p className="field-error">{error.title}</p>}
//           </div>

//           <div className="form-input">
//             <label htmlFor="category">Category</label>
//             <select
//               className="form-input-field"
//               id="category"
//               value={form.category}
//               onChange={handleChange}
//               required
//             >
//               <option value="" disabled>
//                 Select a Category
//               </option>
//               <option value="Care Guide">Care Guide</option>
//               <option value="Tips">Tips</option>
//               <option value="FAQ">FAQ</option>
//               <option value="Beginner Guide">Beginner Guide</option>
//               <option value="Troubleshooting">Troubleshooting</option>
//               <option value="Advanced Technique">Advanced Technique</option>
//             </select>
//             {error.category && <p className="field-error">{error.category}</p>}
//           </div>

//           <div className="form-input">
//             <label htmlFor="author">Author</label>
//             <input
//               className="form-input-field"
//               id="author"
//               type="text"
//               value={form.author}
//               onChange={handleChange}
//               required
//             />
//             {error.author && <p className="field-error">{error.author}</p>}
//           </div>

//           <div className="form-input">
//             <label htmlFor="content">Content</label>
//             <textarea
//               className="form-input-field"
//               id="content"
//               rows="8"
//               value={form.content}
//               onChange={handleChange}
//               required
//             />
//             {error.content && <p className="field-error">{error.content}</p>}
//           </div>

//           <div className="form-input">
//             <label htmlFor="image">Article Image</label>

//             {isEdit && form.imageUrl && (
//               <div style={{ marginBottom: "8px" }}>
//                 <img src={form.imageUrl} alt="Existing" style={{ width: "90px" }} />
//               </div>
//             )}

//             <input
//               className="form-input-field"
//               id="image"
//               type="file"
//               accept="image/*"
//               onChange={(e) =>
//                 setForm((prev) => ({
//                   ...prev,
//                   image: e.target.files?.[0] || null,
//                 }))
//               }
//             />
//             {error.image && <p className="field-error">{error.image}</p>}
//           </div>

//           <button type="submit" className="add-article-btn">
//             {isEdit ? "Update Article" : "Add Article"}
//           </button>
//         </fieldset>
//       </form>

//       {showModal && (
//         <div className="modal-backdrop" onClick={handleClose}>
//           <div className="modal-card" onClick={(e) => e.stopPropagation()}>
//             <h3 className="modal-title">{message}</h3>
//             <button className="modal-close-btn" onClick={handleClose}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ArticleForm;


import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./ArticleForm.css";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
import AdminNavbar from "./AdminNavbar";
import UserNavbar from "../UserComponents/UserNavbar";

const ArticleForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const storedUser = JSON.parse(localStorage.getItem("userData"));

  const editData = location.state || null;
  const routeId = params.id;
  const isEdit = !!routeId || !!editData;

  const [initialSnapshot, setInitialSnapshot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    author: "",
    content: "",
    image: null,
    imageUrl: "",
  });

  const token = storedUser?.token;

  const getHeaders = () => (token ? { Authorization: `Bearer ${token}` } : {});

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const norm = (v) => (v == null ? "" : String(v)).trim();

  const buildSnapshot = (f) => ({
    title: norm(f.title),
    category: norm(f.category),
    author: norm(f.author),
    content: norm(f.content),
    imageUrl: norm(f.imageUrl),
  });

  const isSameSnapshot = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  useEffect(() => {
    if (editData) {
      const nextForm = {
        title: editData.title ?? editData.Title ?? "",
        category: editData.category ?? editData.Category ?? "",
        author: editData.author ?? editData.Author ?? "",
        content: editData.content ?? editData.Content ?? "",
        image: null,
        imageUrl: editData.articleImage ?? editData.ArticleImage ?? editData.image ?? "",
      };
      setForm(nextForm);
      setInitialSnapshot(buildSnapshot(nextForm));
      return;
    }

    if (routeId) {
      axios
        .get(`${API_BASE_URL}/api/articles/${routeId}`, { headers: getHeaders() })
        .then((res) => {
          const a = res.data;
          const nextForm = {
            title: a.title ?? a.Title ?? "",
            category: a.category ?? a.Category ?? "",
            author: a.author ?? a.Author ?? "",
            content: a.content ?? a.Content ?? "",
            image: null,
            imageUrl: a.articleImage ?? a.ArticleImage ?? a.image ?? "",
          };
          setForm(nextForm);
          setInitialSnapshot(buildSnapshot(nextForm));
        })
        .catch(console.error);
    }
  }, [editData, routeId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const validate = () => {
    const temperr = {};
    if (form.title.trim() === "") temperr.title = "Title is required";
    if (form.category.trim() === "") temperr.category = "Category is required";
    if (form.author.trim() === "") temperr.author = "Author is required";
    if (form.content.trim() === "") temperr.content = "Content is required";

    if (!isEdit && form.image === null) temperr.image = "Image is required";
    if (isEdit && !form.image && !form.imageUrl) temperr.image = "Image is required";

    setError(temperr);
    return Object.keys(temperr).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      if (isEdit && initialSnapshot) {
        const currentSnapshot = buildSnapshot(form);
        const noTextChanges = isSameSnapshot(currentSnapshot, initialSnapshot);
        const noNewImagePicked = !form.image;

        if (noTextChanges && noNewImagePicked) {
          setMessage("No changes made (update will not work).");
          setShowModal(true);
          setIsSubmitting(false);
          return;
        }
      }

      let articleImageString = form.imageUrl;
      if (form.image) {
        articleImageString = await fileToBase64(form.image);
      }

      const payload = {
        ArticleId: isEdit ? Number(routeId) : 0,
        Title: form.title,
        Category: form.category,
        Content: form.content,
        Author: form.author,
        ArticleImage: articleImageString,
      };

      if (isEdit) {
        await axios.put(`${API_BASE_URL}/api/articles/${routeId}`, payload, {
          headers: getHeaders(),
        });
        setMessage("Article updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/articles`, payload, {
          headers: getHeaders(),
        });
        setMessage("Article added successfully!");
      }

      setShowModal(true);
    } catch (err) {
      console.error(err);
      setMessage("Oops! Something went wrong.");
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    if (message === "No changes made (update will not work).") return;
    navigate("/view");
  };

  return (
    <>
      {storedUser?.role === "Admin" ? <AdminNavbar /> : <UserNavbar />}

      <form className="article-form" onSubmit={handleSubmit}>
        <fieldset className="form-container">
          <div className="top-row">
            <button type="button" className="back-btn" onClick={() => navigate(-1)}>
              Back
            </button>
            <h2 className="form-title">{isEdit ? "Edit Article" : "Create New Article"}</h2>
            <div className="spacer" />
          </div>

          <div className="form-input">
            <label htmlFor="title">Title</label>
            <input
              className="form-input-field"
              id="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              
            />
            {error.title && <p className="field-error">{error.title}</p>}
          </div>

          <div className="form-input">
            <label htmlFor="category">Category</label>
            <select
              className="form-input-field"
              id="category"
              value={form.category}
              onChange={handleChange}
              
            >
              <option value="" disabled>
                Select a Category
              </option>
              <option value="Care Guide">Care Guide</option>
              <option value="Tips">Tips</option>
              <option value="FAQ">FAQ</option>
              <option value="Beginner Guide">Beginner Guide</option>
              <option value="Troubleshooting">Troubleshooting</option>
              <option value="Advanced Technique">Advanced Technique</option>
            </select>
            {error.category && <p className="field-error">{error.category}</p>}
          </div>

          <div className="form-input">
            <label htmlFor="author">Author</label>
            <input
              className="form-input-field"
              id="author"
              type="text"
              value={form.author}
              onChange={handleChange}
              
            />
            {error.author && <p className="field-error">{error.author}</p>}
          </div>

          <div className="form-input">
            <label htmlFor="content">Content</label>
            <textarea
              className="form-input-field"
              id="content"
              rows="8"
              value={form.content}
              onChange={handleChange}
              
            />
            {error.content && <p className="field-error">{error.content}</p>}
          </div>

          <div className="form-input">
            <label htmlFor="image">Article Image</label>
            {isEdit && form.imageUrl && (
              <div style={{ marginBottom: "8px" }}>
                <img src={form.imageUrl} alt="Existing" style={{ width: "90px" }} />
              </div>
            )}
            <input
              className="form-input-field"
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm((prev) => ({ ...prev, image: e.target.files?.[0] || null }))
              }
            />
            {error.image && <p className="field-error">{error.image}</p>}
          </div>

          <button type="submit" className="add-article-btn" disabled={isSubmitting}>
            {isSubmitting ? (isEdit ? "Updating..." : "Adding...") : isEdit ? "Update Article" : "Add Article"}
          </button>
        </fieldset>
      </form>

      {showModal && (
        <div className="modal-backdrop" onClick={handleClose}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{message}</h3>
            <button className="modal-close-btn" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ArticleForm;
