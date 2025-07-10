// SERVICIOS CRUD PARA GESTIÓN DE USUARIOS
// =======================================

const API_BASE_URL = "http://localhost:3000"

// Importación de SweetAlert2
const Swal = window.Swal

/**
 * Servicio para obtener todos los usuarios
 * @returns {Promise<Array>} Lista de usuarios
 */
export async function getAllUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/users`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching users:", error)
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load users",
      confirmButtonColor: "#667eea",
    })
    throw error
  }
}

/**
 * Servicio para obtener un usuario por ID
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Datos del usuario
 */
export async function getUserById(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error)
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load user data",
      confirmButtonColor: "#667eea",
    })
    throw error
  }
}

/**
 * Servicio para crear un nuevo usuario
 * @param {Object} userData - Datos del usuario
 * @returns {Promise<Object>} Usuario creado
 */
export async function createUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const createdUser = await response.json()

    await Swal.fire({
      icon: "success",
      title: "Success!",
      text: "User created successfully",
      timer: 1500,
      showConfirmButton: false,
    })

    return createdUser
  } catch (error) {
    console.error("Error creating user:", error)
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to create user",
      confirmButtonColor: "#667eea",
    })
    throw error
  }
}

/**
 * Servicio para actualizar un usuario existente
 * @param {string} userId - ID del usuario
 * @param {Object} userData - Datos actualizados del usuario
 * @returns {Promise<Object>} Usuario actualizado
 */
export async function updateUser(userId, userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const updatedUser = await response.json()

    await Swal.fire({
      icon: "success",
      title: "Success!",
      text: "User updated successfully",
      timer: 1500,
      showConfirmButton: false,
    })

    return updatedUser
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error)
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to update user",
      confirmButtonColor: "#667eea",
    })
    throw error
  }
}

/**
 * Servicio para eliminar un usuario
 * @param {string} userId - ID del usuario a eliminar
 * @returns {Promise<boolean>} True si se eliminó correctamente
 */
export async function deleteUser(userId) {
  try {
    // Mostrar confirmación antes de eliminar
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#667eea",
      confirmButtonText: "Yes, delete it!",
    })

    if (!result.isConfirmed) {
      return false
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    await Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "User has been deleted successfully",
      timer: 1500,
      showConfirmButton: false,
    })

    return true
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error)
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to delete user",
      confirmButtonColor: "#667eea",
    })
    throw error
  }
}

/**
 * Servicio para inicializar el sistema de IDs secuenciales
 * @returns {Promise<number>} Próximo ID disponible
 */
export async function initializeUserIds() {
  try {
    const users = await getAllUsers()

    if (users.length === 0) {
      return 0
    }

    // Encontrar el ID más alto y establecer el siguiente
    const maxId = Math.max(...users.map((user) => Number.parseInt(user.id) || 0))
    return maxId + 1
  } catch (error) {
    console.error("Error initializing user IDs:", error)
    return 0
  }
}

/**
 * Servicio para validar datos de usuario
 * @param {Object} userData - Datos del usuario a validar
 * @returns {Object} Resultado de la validación
 */
export function validateUserData(userData) {
  const errors = []

  // Validar nombre
  if (!userData.name || userData.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long")
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!userData.email || !emailRegex.test(userData.email)) {
    errors.push("Please enter a valid email address")
  }

  // Validar teléfono
  const phoneRegex = /^\d{10,15}$/
  if (!userData.phone || !phoneRegex.test(userData.phone.replace(/\D/g, ""))) {
    errors.push("Phone number must contain 10-15 digits")
  }

  // Validar número de inscripción
  if (!userData.enrollNumber || userData.enrollNumber.trim().length < 3) {
    errors.push("Enroll number must be at least 3 characters long")
  }

  // Validar fecha de admisión
  if (!userData.dateOfAdmission) {
    errors.push("Date of admission is required")
  } else {
    const admissionDate = new Date(userData.dateOfAdmission)
    const today = new Date()
    if (admissionDate > today) {
      errors.push("Date of admission cannot be in the future")
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Servicio para buscar usuarios por término
 * @param {Array} users - Lista de usuarios
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Array} Usuarios filtrados
 */
export function searchUsers(users, searchTerm) {
  if (!searchTerm || searchTerm.trim() === "") {
    return users
  }

  const term = searchTerm.toLowerCase().trim()

  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.phone.includes(term) ||
      user.enrollNumber.toLowerCase().includes(term),
  )
}

/**
 * Servicio para ordenar usuarios
 * @param {Array} users - Lista de usuarios
 * @param {string} field - Campo por el cual ordenar
 * @param {string} direction - Dirección del ordenamiento (asc/desc)
 * @returns {Array} Usuarios ordenados
 */
export function sortUsers(users, field, direction = "asc") {
  return [...users].sort((a, b) => {
    let valueA = a[field]
    let valueB = b[field]

    // Convertir a números si es necesario
    if (field === "id") {
      valueA = Number.parseInt(valueA)
      valueB = Number.parseInt(valueB)
    }

    // Convertir a fechas si es necesario
    if (field === "dateOfAdmission") {
      valueA = new Date(valueA)
      valueB = new Date(valueB)
    }

    // Convertir a minúsculas para strings
    if (typeof valueA === "string") {
      valueA = valueA.toLowerCase()
      valueB = valueB.toLowerCase()
    }

    if (direction === "asc") {
      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0
    } else {
      return valueA > valueB ? -1 : valueA < valueB ? 1 : 0
    }
  })
}

/**
 * Servicio para exportar usuarios a CSV
 * @param {Array} users - Lista de usuarios
 * @returns {string} Contenido CSV
 */
export function exportUsersToCSV(users) {
  const headers = ["ID", "Name", "Email", "Phone", "Enroll Number", "Date of Admission"]
  const csvContent = [
    headers.join(","),
    ...users.map((user) =>
      [user.id, `"${user.name}"`, user.email, user.phone, user.enrollNumber, user.dateOfAdmission].join(","),
    ),
  ].join("\n")

  return csvContent
}

/**
 * Servicio para descargar archivo CSV
 * @param {string} csvContent - Contenido CSV
 * @param {string} filename - Nombre del archivo
 */
export function downloadCSV(csvContent, filename = "users.csv") {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
