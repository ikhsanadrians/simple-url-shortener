import { FiLink } from "react-icons/fi"
import { FaRegClipboard } from "react-icons/fa6"
import axios from "axios"
import { env } from "./utils/env";
import { response } from "./utils/types/response";
import React,{useState, ChangeEvent} from 'react' 


function App() {
  const [urlData,setUrlData] = useState<response>({});
  const [urlFromInput,setUrlFromInput] = useState<string>("");
  
  const fetchData = () => {
    axios.post(env.url,{
      "long_url": urlFromInput,
      // eslint-disable-next-line no-useless-escape
      "domain": 'https:\/\/t.ly\/',
      "expire_at_datetime": "2035-01-17 15:00:00",
      "description": "Link From User",
      "public_stats": true,
    },{
      headers:{
        "Authorization" : `Bearer ${env.token}`,
        "Content-Type" : "application/json",
        "Accept" : "application/json"
      }
    }).then((response)=>setUrlData(response.data))
  }

  const getDataFromInput = (e: ChangeEvent<HTMLInputElement>) => {
      setUrlFromInput(e.target.value)
  }

  const copyToClipboard = async (text: string | undefined) => {
    if (text) {
      await navigator.clipboard.writeText(text);
    }
  }

 
  console.log(urlData)
  
  return (
    <>
     <div className="container mx-auto pt-8 flex justify-center">
        <div className="card bg-white p-8 w-full lg:w-2/3 h-full shadow-sm rounded-md">
           <h1>Url Shortener</h1>
           <div className="url-input py-4 relative flex items-center overflow-hidden w-full h-fit">
              <FiLink className="absolute left-4"/>
              <input onChange={(e)=>getDataFromInput(e)} type="text" className="w-full bg-sky-100 outline-none py-4 pl-10 pr-6 rounded-2xl" placeholder="Paste A Long URL" />
              <button onClick={()=>fetchData()} className="absolute right-0 bg-gradient-to-r from-blue-500 to-sky-500 h-2/3 text-white rounded-r-2xl px-2">Shorten</button>
           </div>
           { urlData.short_url != null && (
            <>
              <h1>Here Your Shorten URL</h1>
               { 
                 <div className="shorten-url bg-slate-100 p-5 my-3 rounded-2xl shadow-sm flex items-center justify-between">
                   <p>{ urlData.short_url }</p>
                   <button onClick={()=>copyToClipboard(urlData.short_url)}>
                     <FaRegClipboard size="23"/>
                   </button>
                 </div>
               }
            </>
           )
           }
        </div>
     </div>
        
    </>
  )
}

export default App
