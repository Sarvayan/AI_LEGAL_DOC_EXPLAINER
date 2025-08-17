import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import UploadArea from '../components/UploadArea.jsx'
import DocumentCard from '../components/DocumentCard.jsx'

export default function Dashboard() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const load = async () => {
    setLoading(true) 
    try {
      const { data } = await api.get('/api/documents')
      setDocs(data)
    } catch (e) {
      console.error(e) 
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onUploaded = () => load()

  const deleteDoc = async (id) => {
    if (!confirm('Delete this document?')) return
    await api.delete(`/api/documents/${id}`)
    load()
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <UploadArea onUploaded={onUploaded} />
      <div style={{
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '20px',
        marginTop: '20px'
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: 0 }}>Your Documents</h3>
          <button 
            onClick={load}
            style={{
              padding: '8px 16px',
              background: '#f0f0f0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Refresh
          </button>
        </div>
        {loading ? <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div> :
          docs.length === 0 ? <div style={{ color: '#666', fontSize: '14px' }}>No documents yet. Upload a PDF to get started.</div> :
          docs.map(d => <DocumentCard key={d.id} doc={d} onDelete={deleteDoc} />)
        }
      </div>  
    </div>
  )
}