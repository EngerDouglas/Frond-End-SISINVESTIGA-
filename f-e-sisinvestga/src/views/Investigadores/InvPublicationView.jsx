import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { useNavigate } from 'react-router'
import NavInvestigator from '../../components/Comunes/NavInvestigator'
import PublicationCard from '../../components/Publicaciones/PublicationCard'
import Pagination from '../../components/Comunes/Pagination'
import { getUserData, deleteData } from '../../services/apiServices'
import AlertComponent from '../../components/Comunes/AlertComponent'
import '../../css/componentes/Publicaciones/InvPublicationView.css'

const InvPublicationView = () => {
  const [publications, setPublications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPublicationViews = async () => {
      try {
        const data = await getUserData('publications', { page, limit: 6})
        if (data && data.data) {
          setPublications(data.data)
          setTotalPages(Math.ceil(data.total / data.limit))
        } else {
          setPublications([])
        }
        setLoading(false)
      } catch (error) {
        console.error('Error al cargar las publicaciones', error)
        setError('Error al cargar las publicaciones')
        setLoading(false)
      }
    }

    fetchPublicationViews()
  }, [page])

  const handleAddPublication = () => {
    navigate('/publicaciones/agregar')
  }

  const handleEditPublication = (publicationId) => {
    navigate(`/publicaciones/editar/${publicationId}`)
  }

  const handleDeletePublication = async (publicationId) => {
    try {
      AlertComponent.warning("¿Estás seguro que deseas eliminar esta publicacion")
        .then((result) => {
          if (result.isConfirmed) {
            deleteData('publications', publicationId)
            .then(() => {
              AlertComponent.success('La publicacion ha sido eliminado correctamente.')
              setPublications(publications.filter((publication) => publication._id !== publicationId))
            })
            .catch((error) => {
              if (error.response && error.response.data) {
                const errorMessages = error.response.data.errors || [
                  error.response.data.error,
                ]
                errorMessages.forEach((err) => AlertComponent.error(err.msg || err))
              } else {
                AlertComponent.error("Error al eliminar la publicacion")
              }
            })
          }
        })
    } catch (error) {
      console.error("Error al eliminar la publicacion", error)
    }
  }

  if (loading) {
    return <div>Cargando Proyectos...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <NavInvestigator />
      <div className='inv-publication-view'>
        <h1>Mis Publicaciones</h1>

        <button className="add-publication-btn" onClick={handleAddPublication}>
          <FaPlus /> Agregar Publication
        </button>

        <div className="publications-list">
          {publications.length > 0 ? (
            publications.map((publication) => (
              <PublicationCard
                key={publication._id}
                publication={publication}
                onEdit={handleEditPublication}
                onDelete={handleDeletePublication}
              />
            ))
          ) : (
            <p>No tienes publicaciones aún. ¡Agrega una nuevo!</p>
          )}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onNext={() => setPage(page + 1)}
          onPrev={() => setPage(page - 1)}
          disabledPrev={page === 1}
          disabledNext={page === totalPages}
        />
      </div>
    </>
  )
}

export default InvPublicationView