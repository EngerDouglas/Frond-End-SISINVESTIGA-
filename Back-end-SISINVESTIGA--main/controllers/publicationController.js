import Publication from '../models/Publication.js'
import validator from 'validator'

// **************************** Crear Publicacion ************************************************* //

export const createPublication = async (req, res) => {
  try {
    const {
      titulo,
      fecha,
      proyecto,
      revista,
      resumen,
      palabrasClave,
      tipoPublicacion,
      estado,
      anexos,
      idioma
    } = req.body

    // Validaciones que deben hacerse
    if (!titulo || !fecha ||!proyecto ||!revista || !tipoPublicacion || !idioma) {
      return res.status(400).json({ error: 'Todos los campos proporcionados deben ser proporcionados' })
    }

    if (!validator.isDate(fecha)) {
      return res.status(400).json({ error: 'Fecha invalida' })
    }

    // traemos el autor que esta en le sesion creando esta publicacion
    const autor = req.user._id

    const newPublication = new Publication({
      ...req.body,
      autores: [autor] 
    })

    await newPublication.save()

    res.status(201).json({ message: 'Publicación creada exitosamente', publication: newPublication })
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la publicación', error: error.message })
  }
}

// **************************** END ************************************************ //


// **************************** Actualizar Publicacion ************************************************* //

export const updatePublication = async (req, res) => {
  const { id } = req.params
  const updates = req.body

  try {
    // revisemos si la publicacion existe
    const publication = await Publication.findById(id)
    if(!publication){
      return res.status(404).json({ error: 'Publicacion no encontrada' })
    }

    // Validaciones de los campos que nos pasara el usuario
    if (updates.fecha && !validator.isDate(updates.fecha)) {
      return res.status(400).json({ error: 'Fecha invalida' })
    }

    // Lista de campos que permitiremos para su actualizacion
    const allowedUpdates = [
      'titulo',
      'fecha',
      'proyecto',
      'revista',
      'resumen',
      'palabrasClave',
      'tipoPublicacion',
      'estado',
      'anexos',
      'idioma',
      'autores'
    ]

    // Actualizar campos permitidos
    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        // Manejo especial para arrays de 'autores' y 'anexos'
        if (Array.isArray(publication[field])) {
          if (field === 'autores') {
            // Validar y agregar solo autores únicos
            const existingAuthors = new Set(publication[field].map(String)); // Convertir a string para evitar problemas de comparación con ObjectId
            updates[field].forEach((authorId) => {
              if (!existingAuthors.has(String(authorId))) {
                publication[field].push(authorId); // Agregar autor solo si no existe
              }
            });
          } else {
            publication[field] = updates[field]; // Reemplazar 'anexos' o cualquier otro array completamente
          }
        } else {
          publication[field] = updates[field]; // Actualizar campos normales
        }
      }
    });

    // Guardamos la publicacion actualizada
    await publication.save()
    res.status(201).json({ message: 'La publicacion fue actualizada correctamente', publication })
  } catch (error) {
    res.status(500).json({ error: 'Ha ocurrido un error al actualizar la publiacion', error: error.message })
  }
}

// **************************** END ************************************************ //


// ******************************** Obtener todas las publicaciones ************************************************* //

export const deletePublication = async (req, res) => {

  const { id } = req.params
  const currentUser = req.user

  try {
    // validar si la publicacion existe en la DB
    const pub = await Publication.findById(id)

    if (!pub) {
      return res.status(404).json({ error:'Publicacion no encontrada' })
    }

    // Verificamos si el usuario es el autor de la publicacion a eliminar
    if (currentUser.role !== 'Administrador' && !pub.autores.some(autor => autor.equals(currentUser._id))) {
      return res.status(403).json({ error: 'No tienes permisos para eliminar esta publicación' });
    }

    // Verificamos si nuestro usuario tiene publicaciones, en caso de tener no puede eliminarse
    // if (pub.autores) {
    //   return res.status(400).json({ error: 'No se puede eliminar la publicacion por que esta asignada a un investigador' })
    // }

    // Eliminamos la investigacion de la base de datos
    await Publication.findByIdAndDelete(id)
    res.status(200).json({ message: 'Publicacion eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la publicacion, error: error.message', error: error.message })
  }
}

// **************************** END ************************************************ //


// ******************************** Obtener todas las publicaciones ************************************************* //

export const getAllPublications = async (req, res) => {
  try {
    const publications = await Publication.find()
    .populate({
      path: 'autores',
      select: '-_id nombre apellido especializacion responsabilidades',
      populate: {
        path: 'role',
        select: '-_id -__v',
      }
    })
    .select('-_id -__v')
    .populate({
      path: 'proyecto',
      select: '-_id',
    })
    res.status(200).json(publications)
  } catch (error) {
    res.status(500).json({ message: 'Error en la consulta de las Publiaciones', error: error.message })
  }
}

// **************************** END ************************************************ //


// ******************************** Obtener todas las publicaciones ************************************************* //

export const getUserPublications = async (req, res) => {

  const currentUser = req.user

  try {
    const userPublications = await Publication.find({ autores: currentUser._id })
      .populate({
        path: 'autores',
        select: '-_id nombre apellido especializacion responsabilidades',
        populate: {
          path: 'role',
          select: '-_id -__v',
        },
      })
      .select('-_id -__v')
      .populate({
        path: 'proyecto',
        select: '-_id',
      })

    // Verificamos si nuestro usuario tiene publicaciones, en caso de tener no puede eliminarse
    if (!userPublications || userPublications.length === 0) {
      return res.status(404).json({ error: 'No se encontraron publicaciones para este usuario.' })
    }

    // Respondemos con las publicaciones de nuestro usuarios
    res.status(200).json(userPublications)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las publicaciones del usuario', error: error.message })
  }
}

// **************************** END ************************************************ //



// ******************************** Obtener publicaciones por ID ************************************************* //

export const getPubById = async (req, res) => {
  try {
    const { id } = req.params
    const publication = await Publication.findById(id)
    .populate({
      path: 'autores',
      select: '-_id nombre apellido especializacion responsabilidades',
      populate: {
        path: 'role',
        select: '-_id -__v',
      }
    })
    .select('-_id -__v')
    .populate({
      path: 'proyecto',
      select: '-_id',
    })

    if (!publication) {
      return res.status(404).json({ error: 'Publicacion no encontrada' })
    }

    res.status(200).json(publication)
  } catch (error) {
    res.status(500).json({ message: 'Error en la consulta de la Publicacion', error: error.message })
  }
}

// **************************** END ************************************************ //


// ******************************** Obtener publicaciones por el titulo ************************************************* //

export const getPubByTitle = async (req, res) => {
  try {
    const { titulo } = req.params

    const publication = await Publication.find({ titulo })
    .populate({
      path: 'autores',
      select: '-_id nombre apellido especializacion responsabilidades',
      populate: {
        path: 'role',
        select: '-_id -__v',
      }
    })
    .select('-_id -__v')
    .populate({
      path: 'proyecto',
      select: '-_id',
    })

    if (publication.length === 0) {
      return res.status(404).json({ error: 'Publicacion no encontrada con el titulo suministrado' })
    }

    res.status(200).json(publication)
  } catch (error) {
    res.status(500).json({ message: 'Error en la consulta de la Publicacion', error: error.message })
  }
}

// **************************** END ************************************************ //