import { Check, Copy, ExternalLink, X } from 'lucide-react'
import { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

function MessageBubble({ role, content, images = [], image = [] }) {
  const isUser = role === "user"
  const [lightBox, setLightBox] = useState(null)
  const [copiedCode, setCopiedCode] = useState("")

  const displayImages = images.length > 0 ? images : image;

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => {
      setCopiedCode("")
    }, 2000)
  }


  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`w-fit max-w-[94vw] sm:max-w-[85%] md:max-w-[76%] lg:max-w-[72%]
  px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl
  break-words overflow-hidden
  leading-relaxed text-[13.5px] sm:text-[14px]
        ${isUser
          ? "bg-gradient-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm"
          : " text-slate-200 rounded-tl-sm"
        }`}>


        {displayImages.length > 0 && (
          <div className='flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4 max-w-full'>
            {displayImages.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setLightBox(img)}
                loading="lazy"
                onError={(e) => e.currentTarget.remove()}
                className="w-28 h-20 sm:w-36 sm:h-24 md:w-40 md:h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition shrink-0"
              />
            ))}
          </div>
        )}


        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className='text-xl sm:text-2xl font-bold mt-4 sm:mt-5 mb-2 sm:mb-3'>{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className='text-lg sm:text-xl font-semibold mt-3 sm:mt-4 mb-2'>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className='text-base sm:text-lg font-semibold mt-2.5 sm:mt-3 mb-1.5'>{children}</h3>
            ),
            p: ({ children }) => (
              <p className='mb-2.5 sm:mb-3 whitespace-pre-wrap break-words'>{children}</p>
            ),
            ul: ({ children }) => (
              <ul className='list-disc pl-4 sm:pl-5 space-y-1 my-2'>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className='list-decimal pl-4 sm:pl-5 space-y-1 my-2'>{children}</ol>
            ),
            table: ({ children }) => (
              <div className='overflow-x-auto my-3 sm:my-4 max-w-full [scrollbar-width:thin]'>
                <table className='min-w-full border border-white/10 text-xs sm:text-sm'>
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className='border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-left'>
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className='border border-white/10 px-2.5 sm:px-3 py-1.5 sm:py-2'>
                {children}
              </td>
            ),
            a: ({ href, children }) => (
              <a href={href}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 underline inline-flex items-center gap-1 break-all"
              >
                {children}
                <ExternalLink size={13} className="shrink-0" />
              </a>
            ),
            code: ({ className, children }) => {
              const value = String(children).trim()

              if (!className) {
                return (
                  <code className='px-1.5 py-0.5 rounded bg-white/10 text-indigo-200 text-xs sm:text-[13px] break-all'>
                    {value}
                  </code>
                )
              }

              const language = className.replace("language-", "")

              return (
                <div className='my-3 sm:my-4 overflow-hidden rounded-xl border border-white/10 bg-[#111318] max-w-full'>
                  <div className='flex items-center justify-between bg-[#1b1d24] border-b border-white/10 px-3 sm:px-4 py-1.5 sm:py-2'>
                    <span className='uppercase text-[11px] sm:text-xs text-slate-400'>
                      {language}
                    </span>
                    <button className='flex items-center gap-1 text-[11px] sm:text-xs text-slate-300 hover:text-white cursor-pointer' 
                    onClick={() => copyCode(value)}>
                      {
                        copiedCode === value ?
                          <>
                            <Check size={13}/>
                            Copied
                          </> :
                          <><Copy size={13} />Copy</>
                      }
                    </button>
                  </div>

                  <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    wrapLongLines
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      padding: "12px 14px",
                      background: "#0d1117",
                      fontSize: "12px",
                      overflowX: "auto"
                    }}
                  >
                    {value}
                  </SyntaxHighlighter>
                </div>
              )
            },
            img:({src})=>{
              if(!src) return null;
              return (
                <img
                  src={src}
                  onClick={() => setLightBox(src)}
                  loading="lazy"
                  onError={(e) => e.currentTarget.remove()}
                  className="max-w-full h-auto max-h-72 sm:max-h-96 rounded-xl object-contain border border-white/10 cursor-zoom-in hover:opacity-90 transition my-2"
                />
              )
            }
          }}
        >
          {content}
        </Markdown>

      </div>
      {lightBox &&
        <div className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6'>
          <button
            className='absolute top-3 right-3 sm:top-5 sm:right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2 cursor-pointer'
            onClick={() => setLightBox(null)}
          >
            <X size={18} />
          </button>
          <img
            src={lightBox}
            className="max-w-[95vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain"
          />
        </div>}
    </div>
  )
}

export default MessageBubble
