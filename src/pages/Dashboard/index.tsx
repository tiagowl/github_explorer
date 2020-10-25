import React, { useState, FormEvent, useEffect } from 'react';

import { Title, Form, Repositories, Error } from './styles';
import logo from '../../assets/logo.svg';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

interface Repository{
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    }
}

const Dashboard: React.FC = () => {

    const [repositories, setRepositories] = useState<Repository[]>(()=>{
        const storageRepositories = localStorage.getItem('@GithubExplorer:repositories');

        if(storageRepositories){
            return JSON.parse(storageRepositories);
        }else{
            return [];
        }
    });
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');

    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void>{

        event.preventDefault();

        if(!newRepo){
            setInputError('Digite o nome do autor e o nome do repositório');
            return;
        }

        try{
            const response = await api.get<Repository>(`repos/${newRepo}`);

            const repository = response.data;

            setRepositories([...repositories, repository]);
        } catch(err){
            setInputError('Erro na requisição');
        }
    }

    useEffect(()=>{
        localStorage.setItem('@GithubExplorer: repositories', JSON.stringify(repositories));
    }, [repositories]);

  return(
      <>
        <img src={logo} alt=""/>
        <Title>Explore repositórios no github</Title>

        <Form hasError={Boolean(inputError)} onSubmit={handleAddRepository} >
            <input value={newRepo} onChange={e => setNewRepo(e.target.value)} type="text" placeholder="Digite o nome do repositório"/>
            <button type="submit" >Pesquisar</button>
        </Form>

        { inputError && <Error>{inputError}</Error> }

        <Repositories>
            {repositories.map(repository => (
                <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
                    <img src={repository.owner.avatar_url} alt={repository.owner.login}/>
                    <div>
                        <strong>{repository.full_name}</strong>
                        <p>{repository.description}</p>
                    </div>

                <FiChevronRight size={20} />
                </Link>
            ))}
        </Repositories>
      </>
  );
}

export default Dashboard;
