import { Link } from 'react-router-dom'

export default function DocumentCard({ doc, onDelete }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '16px',
      marginBottom: '12px'
    }}>
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontWeight: 'bold' }}>{doc.originalFileName}</div>
          <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
            {new Date(doc.createdAt).toLocaleString()}
          </div>
        </div> 
        <div style={{ display: 'flex', gap: '8px' }}> 
          <Link 
            to={`/documents/${doc.id}`}
            style={{
              padding: '8px 16px',
              background: '#4285f4',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            Open
          </Link>
          <button 
            onClick={() => onDelete(doc.id)}
            style={{
              padding: '8px 16px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Delete
          </button>
        </div>
      </div>
      <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
        {doc.hasSummary ? 
          <span style={{
            background: '#4caf50',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px'
          }}>Summary</span> : 
          <span style={{
            background: '#e0e0e0',
            color: '#666',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px'
          }}>No Summary Yet</span>}
        
        {doc.hasRisks ? 
          <span style={{
            background: '#ff9800',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px'
          }}>Risks</span> : 
          <span style={{
            background: '#e0e0e0',
            color: '#666',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px'
          }}>No Risks</span>}
      </div>
    </div>
  )
}