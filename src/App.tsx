import { FiLink, FiAlertTriangle } from "react-icons/fi"
import { FaRegClipboard } from "react-icons/fa6"
import axios from "axios"
import { env } from "./utils/env";
import { response } from "./utils/types/response";
import React, { useState, ChangeEvent } from 'react'
import { Tooltip as ReactTooltip } from "react-tooltip";
import HashLoader from "react-spinners/HashLoader";


function App() {
  const [urlData, setUrlData] = useState<response>({});
  const [urlFromInput, setUrlFromInput] = useState<string>("");
  const [isCopiedBtnClicked, setIsCopiedBtnClicked] = useState<boolean>(false)
  const [isInputValueInvalid, setIsInputValueInvalid] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchData = async () => {
    try {
      setUrlData({});
      setLoading(true);
      const response = await axios.post(env.url, {
        long_url: urlFromInput,
        domain: 'https://t.ly/',
        expire_at_datetime: '2035-01-17 15:00:00',
        description: 'Link From User',
        public_stats: true,
      }, {
        headers: {
          Authorization: `Bearer ${env.token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      setUrlData(response.data);
    } catch (error) {
      checkIfInputInvalid();
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const getDataFromInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUrlFromInput(e.target.value)
  } 

  const checkIfInputInvalid = () => {
    setIsInputValueInvalid(true)
    setUrlFromInput("")
    setTimeout(()=>setIsInputValueInvalid(false),1000)
  }

  const copyToClipboard = async (text: string | undefined) => {
    if (text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setIsCopiedBtnClicked(true);
          setTimeout(() => setIsCopiedBtnClicked(false), 800);
        })
        .catch((error) => {
          console.error('Error copying to clipboard:', error);
        });
    }
  }



  console.log(urlData)

  return (
    <>
      <div className="container mx-auto pt-8 flex justify-center">
        <div className="card bg-white p-8 w-full lg:w-2/3 h-full shadow-sm rounded-md">
          <h1>Url Shortener</h1>
          <div className="url-input py-4 relative flex items-center overflow-hidden w-full h-fit">
            <FiLink size={20} className="absolute left-4" />
            <input value={urlFromInput} onChange={(e) => getDataFromInput(e)} type="text" className="w-full bg-sky-100 outline-none py-4 pl-10 pr-6 rounded-2xl" placeholder="Paste A Long URL" />
            <button onClick={() => fetchData()} className="absolute right-0 bg-gradient-to-r from-blue-500 to-sky-500 h-2/3 text-white rounded-r-2xl px-2 hover:shadow-lg">Shorten</button>
          </div>
          {
            loading && (
              <div className="loading flex justify-center mt-8">
                <HashLoader color="#0ea5e9" />
              </div>
            )
          }
          { isInputValueInvalid &&
            <div className="invalid-url flex justify-center mt-4">
              <div className="wrapper flex-row flex justify-start gap-2 rounded-2xl bg-red-100 border-red-300 border-[2px] shadow-red-500 text-black p-4 w-full items-center">
                <FiAlertTriangle size={30} color="red" />
                <h1 className="font-semibold mt-1 text-slate-800">Invalid URL!</h1>
              </div>
            </div>
          }
          {urlData.short_url && (
            <>
              <h1>Here Your Shorten URL</h1>
              {
                <>
                  <div className="shorten-url bg-slate-100 p-5 my-3 rounded-2xl shadow-sm flex items-center justify-between">
                    <p>{urlData.short_url}</p>
                    <button data-tooltip-id="copied" onClick={() => copyToClipboard(urlData.short_url)}>
                      <FaRegClipboard size="23" />
                    </button>
                    <ReactTooltip
                      id="copied"
                      place="top"
                      variant="info"
                      style={{ backgroundColor: "rgb(36, 41, 45)" }}
                      content="Copied"
                      isOpen={isCopiedBtnClicked}
                    />
                  </div>
                  <p className="mt-4 text-slate-500">Long Url : <br /><span className="text-slate-800">{urlData.long_url}</span></p>
                </>
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
