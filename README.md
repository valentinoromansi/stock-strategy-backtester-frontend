# Install and Run
## Requirements:
- Node.js 12.18.3
- Npm 6.14.6
- Python 2.7.15
## Build:
- `npm run build`
## Start:
- `npm start`


</br></br></br>


# API - Usage and requirements (used in backend service)
  - APIs used for fetching:
    - Symbols - `https://api.twelvedata.com/stocks?exchange=NASDAQ`
    - Fundamentals - `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apikey}`
    - Vertical slice data - `https://api.twelvedata.com/time_series?&symbol=${symbol}&interval=${interval}&apikey=${apikey}&outputsize=5000`
  - Check if API keys in [api-data.ts](src/data-extractor/api-data.ts) for fetching slice data and fundamentals are still valid


</br></br></br>

<video width="100%" controls>
  <source src="readme-graphics/quick-tutorial.mp4" type="video/mp4">
</video>
