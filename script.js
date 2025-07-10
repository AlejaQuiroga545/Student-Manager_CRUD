// Agregar las importaciones al inicio del archivo
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  initializeUserIds,
  validateUserData,
} from "./services.js"

// SISTEMA DE AUTENTICACIÓN
// ========================

// Usuarios predefinidos (en un proyecto real, esto vendría de una base de datos)
const USERS = [
  { username: "admin", password: "admin123", role: "admin", name: "Administrator" },
  { username: "user", password: "user123", role: "user", name: "Regular User" },
]

let currentUser = null // Usuario actual
// Variable para almacenar el ID del usuario actual
// Se inicializa en null y se actualizará al iniciar sesión
// Se utilizará para identificar al usuario en las operaciones CRUD
let nextUserId = 0 // Variable para controlar el próximo ID

// Importación de Swal
const Swal = window.Swal

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", async () => {
  await initializeUserIds() // Inicializar el sistema de IDs
  checkAuthStatus() // Verificar el estado de autenticación al cargar la página
  setupLoginForm() // Configurar el formulario de login
  setupLogout() // Configurar el botón de logout
})

// Verificar estado de autenticación
function checkAuthStatus() { // Verificar si hay un usuario guardado en localStorage
  // Si hay un usuario guardado, mostrar la aplicación principal
  // Si no hay usuario guardado, mostrar la pantalla de login
  // Esto permite que el usuario permanezca autenticado incluso al recargar la página
  // Utiliza localStorage para guardar el usuario actual y así mantener la sesión activa entre recargas de página
  // Esto es útil para aplicaciones SPA donde el usuario no quiere volver a iniciar sesión cada vez que recarga la página
  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    showMainApp() // Mostrar la aplicación principal si hay un usuario autenticado
  } else {
    showLoginScreen() // Mostrar la pantalla de login si no hay usuario autenticado
  }
}

// Mostrar pantalla de login
function showLoginScreen() {
  document.getElementById("login-screen").style.display = "flex"
  document.getElementById("main-app").style.display = "none"
}

// Mostrar aplicación principal
function showMainApp() {
  document.getElementById("login-screen").style.display = "none"
  document.getElementById("main-app").style.display = "flex"
  updateUserInterface()
  navigate("/users") // Navegar a la página de usuarios por defecto
}

// Configurar formulario de login
function setupLoginForm() {
  const loginForm = document.getElementById("login-form")
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    // Validar credenciales
    const user = USERS.find((u) => u.username === username && u.password === password)

    if (user) {
      currentUser = user
      localStorage.setItem("currentUser", JSON.stringify(user))

      await Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Welcome ${user.name}`,
        timer: 1500,
        showConfirmButton: false,
      })

      showMainApp()
    } else {
      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid username or password",
        confirmButtonColor: "#667eea",
      })
    }

    // Limpiar formulario
    loginForm.reset()
  })
}

// Configurar logout
function setupLogout() {
  document.getElementById("logout-btn").addEventListener("click", async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#667eea",
      confirmButtonText: "Yes, logout",
    })

    if (result.isConfirmed) {
      currentUser = null
      localStorage.removeItem("currentUser")

      await Swal.fire({
        icon: "success",
        title: "Logged out successfully",
        timer: 1000,
        showConfirmButton: false,
      })

      showLoginScreen()
    }
  })
}

// Actualizar interfaz según el usuario
function updateUserInterface() {
  if (!currentUser) return

  // Actualizar información del usuario
  document.getElementById("user-name").textContent = currentUser.name
  document.getElementById("user-role").textContent = currentUser.role.toUpperCase()
  document.getElementById("user-role").className = `role-badge ${currentUser.role}`

  // Controlar acceso según el rol
  const newUserLink = document.getElementById("new-user-link")
  if (currentUser.role === "admin") {
    newUserLink.style.display = "flex"
  } else {
    newUserLink.style.display = "none"
  }
}

// SECCIÓN DE RUTAS Y NAVEGACIÓN (SPA)
// ===================================

const routes = {
  "/": "./users.html",
  "/users": "./users.html",
  "/newuser": "./newuser.html",
  "/about": "./about.html",
}

// Navegación
document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault()

    // Verificar permisos para nueva usuario
    if (e.target.getAttribute("href") === "/newuser" && currentUser.role !== "admin") {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You do not have permission to access this feature",
        confirmButtonColor: "#667eea",
      })
      return
    }

    navigate(e.target.getAttribute("href"))
  }
})

async function navigate(pathname) {
  // Actualizar navegación activa
  document.querySelectorAll("[data-link]").forEach((link) => {
    link.classList.remove("active")
  })
  document.querySelector(`[href="${pathname}"]`)?.classList.add("active")

  const route = routes[pathname]
  const html = await fetch(route).then((res) => res.text())
  document.getElementById("content").innerHTML = html
  history.pushState({}, "", pathname)

  if (pathname === "/users") {
    renderUsers()
  }

  if (pathname === "/newuser") {
    setUpUserForm()
  }
}

window.addEventListener("popstate", () => navigate(location.pathname))

// OPERACIONES CRUD
// ================

// READ: Mostrar usuarios
async function renderUsers() {
  try {
    const users = await getAllUsers()

    // Mostrar botón de agregar solo para admin
    const addBtn = document.getElementById("add-student-btn")
    if (currentUser.role === "admin") {
      addBtn.classList.remove("hidden")
      addBtn.addEventListener("click", () => navigate("/newuser"))
    }

    const tableHTML = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Enroll Number</th>
          <th>Date of Admission</th>
          ${currentUser.role === "admin" ? "<th>Actions</th>" : ""}
        </tr>
      </thead>
      <tbody>
        ${users
          .map(
            (user) => `
          <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.enrollNumber}</td>
            <td>${user.dateOfAdmission}</td>
            ${
              currentUser.role === "admin"
                ? `
            <td>
              <button data-id="${user.id}" class="btn-edit">Edit</button>
              <button data-id="${user.id}" class="btn-delete">Delete</button>
            </td>
            `
                : ""
            }
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
    `

    document.getElementById("users-table-container").innerHTML = tableHTML

    // Solo agregar event listeners si es admin
    if (currentUser.role === "admin") {
      setupDeleteButtons()
      setupEditButtons()
    }
  } catch (err) {
    console.error("Error getting users:", err)
  }
}

// Configurar botones de eliminar
function setupDeleteButtons() {
  const deleteButtons = document.querySelectorAll(".btn-delete")
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const userId = button.dataset.id

      try {
        const deleted = await deleteUser(userId)
        if (deleted) {
          renderUsers()
        }
      } catch (err) {
        console.error(`Error deleting user: ${err}`)
      }
    })
  })
}

// Configurar botones de editar
function setupEditButtons() {
  const editButtons = document.querySelectorAll(".btn-edit")
  editButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const userId = button.dataset.id

      try {
        const user = await getUserById(userId)
        navigate("/newuser")
        setTimeout(() => setUpUserForm(user), 100)
      } catch (err) {
        console.error(`Error fetching user to edit: ${err}`)
      }
    })
  })
}

// CREATE & UPDATE: Formulario
async function setUpUserForm(userData = null) {
  const form = document.getElementById("user-form")
  const formTitle = document.getElementById("form-title")

  if (userData) {
    formTitle.textContent = "Edit User"
    document.getElementById("user-id").value = userData.id
    document.getElementById("full-name").value = userData.name
    document.getElementById("email").value = userData.email
    document.getElementById("phone").value = userData.phone
    document.getElementById("enrollNumber").value = userData.enrollNumber
    document.getElementById("dateOfAdmission").value = userData.dateOfAdmission
  } else {
    formTitle.textContent = "New User"
    form.reset()
  }

  // Remover event listeners previos
  const newForm = form.cloneNode(true)
  form.parentNode.replaceChild(newForm, form)

  // Agregar nuevo event listener
  document.getElementById("user-form").addEventListener("submit", async (e) => {
    e.preventDefault()

    const userId = document.getElementById("user-id").value
    const userData = {
      name: document.getElementById("full-name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      enrollNumber: document.getElementById("enrollNumber").value,
      dateOfAdmission: document.getElementById("dateOfAdmission").value,
    }

    // Validar datos
    const validation = validateUserData(userData)
    if (!validation.isValid) {
      await Swal.fire({
        icon: "error",
        title: "Validation Error",
        html: validation.errors.map((error) => `• ${error}`).join("<br>"),
        confirmButtonColor: "#667eea",
      })
      return
    }

    // Si es un nuevo usuario, asignar ID secuencial
    if (!userId) {
      userData.id = nextUserId.toString()
    }

    try {
      if (userId) {
        await updateUser(userId, userData)
      } else {
        await createUser(userData)
        nextUserId++
      }

      navigate("/users")
    } catch (err) {
      console.log(`An error occurred: ${err}`)
    }
  })
}