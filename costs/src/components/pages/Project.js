import styles from './Project.module.css'
import { json, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loading from '../layout/Loading';
import Container from '../layout/Container';
import ProjectForm from '../project/ProjectForm';
import Message from "../layout/Message"

import { parse, v4 as uuidv4 } from 'uuid';

import ServiceForm from '../service/ServiceForm';
import ServiceCard from '../service/ServiceCard';

function Project() {

    //Com esse hook useParams conseguimos pegar o valor que está sendo passado na url o id
    //Esse hook ele consegue entender quando realizamos a dinâmica da url para realizar a navegação.
    const { id } = useParams();
    const [project, setProject] = useState([]);
    const [services, setServices] = useState([]);
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");

    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:3001/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(resp => resp.json()).
                then((data) => {
                    console.log(data)
                    setProject(data)
                }).catch(err => console.log(err))
        }, 2000)
    }, [id])


    function editPost(project) {
        setMessage('');
        if (project.budget < project.cost) {
            setMessage('O orçamento não pode ser menor que o custo do projeto!')
            setType('error')
            return false
        }
        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project),
        }).then(resp => resp.json())
            .then((data) => {
                setProject(data)
                setShowProjectForm(!showProjectForm)
                setMessage('Projeto atualizado!')
                setType('sucess')
            })
            .catch(err => console.log(err))
    }

    function createService(project) {
        setMessage('')
        const lastService = project.services[project.services.length - 1]
        lastService.id = uuidv4()

        let lastServiceCost = lastService.cost

        console.log("Valor do projeto:" + project.cost)
        console.log("Valor do projeto anterior:" + lastServiceCost)
        if (project.cost == null) {
            project.cost = 0;
        }
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)
        console.log("Cost" + newCost)

        //Verifica a condição de que eu não consigo adicionar um serviço em que seja maior que meu orçamento
        if (newCost > parseFloat(project.budget)) {
            setMessage('Orçamento ultrapassado, verifique o valor do serviço');
            setType('error')
            project.services.pop()
            return false
        }

        //adicionando o valor do projeto total cost
        project.cost = newCost;
        //update
        fetch(`http://localhost:5000/projects/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        }).then(resp => resp.json()).
            then((data) => {
                console.log("Valor do conteúdo:" + data)
                setServices(data.services)
                setShowServiceForm(!showServiceForm)
            }
            ).catch((err) => console.log(err))
    }


    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm);
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm);
    }

    function removeService(id, cost) {
        const servicesUpdate = project.services.filter(
            (service) => service.id !== id
        )

        const projectUpdated = project

        projectUpdated.services = servicesUpdate
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost);

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectUpdated)
        }).then((resp) => resp.json()).then((data) => {
            setProject(projectUpdated)
            setServices(servicesUpdate)
            setMessage("Serviço removido com sucesso!");
        })
            .catch(err => console.log(err))
    }


    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {message && <Message type={type} msg={message} />}
                        <div className={styles.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>{!showProjectForm ? 'Editar projeto' : 'Fechar'}</button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p>
                                        <span>Categoria:</span> {project.category.name}
                                    </p>
                                    <p>
                                        <span>Total de Orçamento:</span> R${project.budget}
                                    </p>
                                    <p>
                                        <span>Total utilizado:</span> R${project.cost}
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.project_info}>
                                    <ProjectForm handleSubmit={editPost} btnText={"Concluir edição"} projectData={project} />
                                </div>

                            )}
                        </div>
                        <div className={styles.service_form_container}>
                            <h2>Adicione um serviço:</h2>
                            <button className={styles.btn} onClick={toggleServiceForm}>{!showServiceForm ? 'Adicionar Serviço' : 'Fechar'}</button>
                            <div className={styles.project_info}>
                                {showServiceForm && (
                                    <ServiceForm handleSubmit={createService} btnText={"Adicionar Serviço"} projectData={project} />
                                )}
                            </div>
                        </div>
                        <h2>Serviços</h2>
                        <Container customClass="start">
                            {services.length > 0 &&
                                services.map((service) => (
                                    <ServiceCard
                                        id={service.id}
                                        name={service.name}
                                        cost={service.cost}
                                        description={service.description}
                                        key={service.id}
                                        handleRemove={removeService}
                                    />
                                ))
                            }
                            {services.length === 0 && <p>Não há serviços cadastrados.</p>}
                        </Container>
                    </Container>
                </div>
            ) : (
                <div className={styles.loading}>
                    <Loading />
                </div>
            )}
        </>
    )
}

export default Project;