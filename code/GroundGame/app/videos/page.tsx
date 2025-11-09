export default function VideosPage() {
  // TO ADD VIDEOS: Go to YouTube video, copy ID from URL (youtube.com/watch?v=VIDEO_ID_HERE)
  
  const videos = [
    // YOUR FEATURED VIDEO
    {
      id: 'kOEI5kF9Gzs',
      title: 'UnderGround TV Featured Report',
      description: 'Our featured investigative report',
      source: 'UnderGround TV'
    },
    
    // THE GRAYZONE VIDEOS
    // To find: Go to https://www.youtube.com/@thegrayzone7996/videos
    // Click a video, copy the ID from the URL
    {
      id: '_ZkpOZXeJGQ',
      title: 'The Grayzone:  US govt role in disastrous Venezuela coup plot',
      description: 'Add Independent news and investigative journalism on politics and empire.',
      source: 'The Grayzone'
    },
    {
      id: '2hgWOuAh5UM',
      title: 'The JimmyDoreShow: What Everyone Is Missing About The Gaza Ceasefire! w/ Ian Carroll',
      description: ' A crucial, profane, passionate voice for progressives and free-thinkers in 21st century ',
      source: 'The Jimmy Dore Show'
    },
    {
      id: '5KmpT-BoVf4',
      title: 'Tucker Carlson: Sam Altman Interview',
      description: 'OpenAI CEO Sam Altman discusses the future of AI and the suspicious death of Employee.',
      source: 'Tucker Carlson'
    },
    
    // JIMMY DORE SHOW VIDEOS
    // To find: Go to https://www.youtube.com/@thejimmydoreshow/videos
    // Click a video, copy the ID from the URL
    {
      id: 'Kev_-HyuI9Y',
      title: 'Tucker Carlson:OpenAi Employee Mother Speaks on Suspicious Death of Son ',
      description: 'OpenAi Employee Mother Speaks on Suspicious Death of Son',
      source: 'Tucker Carlson'
    },
    {
      id: 'hWIwzZkbbS0',
      title: 'The Grayzone: Israels 8 Front war',
      description: ' Blumenthal covered Israels efforts to control US media and politics, the looming war with Iran, and the future of both American political parties.',
      source: 'Max Blumenthal'
    },
    {
      id: 'ejQwCiDXFrU',
      title: 'The Grayzone: Where does greater Israel End Free Palestine',
      description: 'The brutal history and present day ravages of Greater Israel',
      source: 'Max Blumenthal'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-red-600">VIDEO REPORTS</h1>
        
        <div className="mb-12">
          <p className="text-xl text-gray-300 mb-4">
            Watch our latest investigative reports from UnderGround TV, The Grayzone, and The Jimmy Dore Show.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://www.youtube.com/channel/UCHf6zQDywaqFM1rWeZeciTA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Subscribe to UnderGround TV
            </a>
            <a
              href="https://www.youtube.com/@thegrayzone7996"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              The Grayzone Channel
            </a>
            <a
              href="https://www.youtube.com/@thejimmydoreshow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Jimmy Dore Show
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((video, index) => (
            <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-6">
                {/* Source Badge */}
                <div className="mb-2">
                  <span className={`inline-block text-xs px-3 py-1 rounded font-semibold ${
                    video.source === 'UnderGround TV' ? 'bg-red-600 text-white' :
                    video.source === 'The Grayzone' ? 'bg-gray-600 text-white' :
                    'bg-blue-600 text-white'
                  }`}>
                    {video.source}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{video.title}</h3>
                <p className="text-gray-300">{video.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions for updating videos */}
        {/* <div className="mt-12 bg-blue-900/30 border border-blue-600 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3 text-blue-400">📺 How to Add Real Videos</h3>
          <ol className="space-y-2 text-gray-300 list-decimal list-inside">
            <li>Go to The Grayzone: <a href="https://www.youtube.com/@thegrayzone7996/videos" target="_blank" className="text-blue-400 underline">youtube.com/@thegrayzone7996/videos</a></li>
            <li>Go to Jimmy Dore Show: <a href="https://www.youtube.com/@thejimmydoreshow/videos" target="_blank" className="text-blue-400 underline">youtube.com/@thejimmydoreshow/videos</a></li>
            <li>Click on any video you want to feature</li>
            <li>Copy the video ID from the URL (the part after "watch?v=")</li>
            <li>Edit <code className="bg-gray-800 px-2 py-1 rounded text-green-400">/app/videos/page.tsx</code></li>
            <li>Replace the placeholder IDs with real video IDs</li>
            <li>Update the title and description to match</li>
          </ol>
        </div> */}
      </div>
    </div>
  );
}
