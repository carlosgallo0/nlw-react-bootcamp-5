import { GetStaticProps} from "next"; //tipar por completo: tanto os parametros quanto os retornos dela
import {format, parseISO} from "date-fns";
import {ptBR} from "date-fns/locale/pt-BR";
import {api} from '../services/api';
type Episode ={
  id: string;
  title: string;
  members: string;
  published_at: string;
  //...
}
type HomeProps = {
   episodes: Episode[];
}

export default function Home(props: HomeProps){
  return (
    <>
    <h1>Index</h1>
    <p>{JSON.stringify(props.episodes)}</p>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const {data} = await api.get('episodes',{
    params:{
      _limit: 12,
     _sort: 'published_at',
     _order:'desc'
    }
  })

  const episodes = data.map(episode =>{
    return{
      id: episode.id,
      title: episode.title,
      thumbnail:episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at),'d MMM yy', {locale: ptBR}),//usar o camel case no front para diferenciar da chamada API
      duration: Number(episode.file.duration),
      description:episode.description,
      url:episode.file.url,


    
    }

  })

return {
    props: {
      episodes: data,      
    },
    revalidate: 60 * 60 * 8 //requisição será feita a cada 8 horas 
  }

}