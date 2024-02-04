import ProjectForm from '../project/ProjectForm';
import styles from './NovoProjeto.module.css';
import { useNavigate } from 'react-router-dom'

function NovoProjeto() {

    //Hook utilizado para poder fazer redirecte nas páginas(redirecionar as páginas)
    const navigate = useNavigate();

    function createPost(project) {
        // initialize cost and services
        project.cos = 0
        project.services = []

        fetch('http://localhost:5000/projects', {
            method: "POST",
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(project),
        }).then((resp) => resp.json())
            .then((data) => {
                console.log(data)
                navigate("/projects", { state: { message: 'Projeto criado com sucesso!' } })
            })
            .catch(err => console.log(err))
    }

    return (
        <div className={styles.newproject_container}>
            <h1>Criar Projeto</h1>
            <p>Crie seu projeto para depois adicionar os serviços</p>
            <ProjectForm handleSubmit={createPost} btnText="Criar Projeto" />
        </div>
    )
}

export default NovoProjeto;