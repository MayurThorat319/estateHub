import './ProjectCard.css';
import { useState } from "react";
import { formatINR } from "../utils/money";

const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 280"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#ebe3fa"/><stop offset="1" stop-color="#d9d1f0"/></linearGradient></defs><rect width="320" height="280" fill="url(#g)"/><path d="M42 141L160 47l118 94v112H42Z" fill="#f8f6ff"/><path d="M28 151L160 45l132 106" fill="none" stroke="#7a53bb" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/><rect x="136" y="167" width="48" height="86" rx="4" fill="#a68ad3"/><rect x="72" y="165" width="45" height="43" rx="4" fill="#c7b6e8"/><rect x="207" y="165" width="45" height="43" rx="4" fill="#c7b6e8"/></svg>`;
const fallbackImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(fallbackSvg)}`;

function ProjectCard({ project, onDelete, onEdit }) {
  const [failed, setFailed] = useState(false);
  const imageUrl = project.image?.trim();

  return (
    <article className="latest-property">
      <img
        src={failed || !imageUrl ? fallbackImage : imageUrl}
        alt={project.name}
        className="latest-property-image"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
      <div className="latest-property-info">
        <h3 title={project.name}>{project.name}</h3>
        <p title={`${project.location} · ${project.type || "Property"}`}>
          {project.location} · {project.type || "Property"}
        </p>
        <span className="latest-status">{project.status}</span>
        <strong>
          {formatINR(project.price)}
        </strong>
        <div className="property-card-actions">
          <button type="button" className="latest-edit" onClick={() => onEdit(project)} aria-label={`Edit ${project.name}`} title="Edit property">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z" />
            </svg>
          </button>
          <button type="button" className="latest-delete" onClick={() => onDelete(project._id)} aria-label={`Delete ${project.name}`} title="Delete property">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
