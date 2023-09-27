import { useState } from "react";
import { RiRefreshLine } from "react-icons/ri";
import styled from "styled-components";
import { useSpring, animated } from "@react-spring/web";

const GenerateBtn = styled.button`
  align-self: end;
  border: none;
  background-color: #fff;
  display: flex;
  width: fit-content;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  text-transform: lowercase;
  font-weight: 600;
  &:hover {
    cursor: pointer;
  }
`;
const Footer = styled.footer`
  font-size: 14px;
  text-align: center;
`;
const DeveloperName = styled.span`
  font-weight: 600;
`;
const Quote = styled.div`
  border-left: 8px solid yellow;
  padding-left: 2rem;
  font-size: 1.5rem;
  font-weight: 500;
  @media screen and (min-width: 500) {
    font-size: 2.25rem;
  }
`;

const Author = styled.div`
  margin-top: 1rem;
  align-self: flex-start;
  font-size: ${(props) => props.$fontSize};
  font-weight: bold;
  color: ${({ $textColor }) => $textColor};
  padding-left: 2.5rem;
  &:hover {
    cursor: pointer;
  }
`;

const Tag = styled.span`
  color: #828282;
  display: block;
  font-size: 14px;
`;

const getRandomQuote = async () => {
  try {
    const response = await fetch("https://api.quotable.io/random");
    if (response.ok) {
      const data = await response.json();
      // console.log(response)
      return data;
    }
    throw new Error("Api not responding");
    // console.log(data);
  } catch (error) {
    console.log(error);
  }
};

const getQuoteByAuthor = async (author) => {
  try {
    const response = await fetch(
      `https://api.quotable.io/quotes?author=${author}`
    );
    if (response.ok) {
      const data = await response.json();
      // console.log(response)
      return data;
    }
    throw new Error("Api not responding");
    // console.log(data);
  } catch (error) {
    console.log(error);
  }
};

function App() {
  const [springs, api] = useSpring(() => ({
    from: { rotate: 0 },
  }));
  const startAnimation = () => {
    api.start({
      from: {
        rotate: 0,
      },
      to: {
        rotate: 360,
      },
      loop: true,
    });
  };
  const [quote, setQuote] = useState(null);
  return (
    <div className="container">
      <GenerateBtn
        onClick={async () => {
          startAnimation();
          const quoteObj = await getRandomQuote();
          api.stop();
          // console.log(quoteObj);
          setQuote(quoteObj);
        }}
      >
        <span>Random</span>
        <animated.div
          style={{
            display: "flex",
            ...springs,
          }}
        >
          <RiRefreshLine />
        </animated.div>
      </GenerateBtn>

      <main>
        {quote ? (
          Array.isArray(quote) ? (
            <div className="quoteWrapper">
              <Author $fontSize={"36px"} $textColor={"#333333"}>
                {quote[0].author}
              </Author>
              <div className="array_of_quotes">
                {quote.map((quote) => (
                  <Quote key={quote._id}>{quote.content}</Quote>
                ))}
              </div>
            </div>
          ) : (
            <div className="quoteWrapper">
              <Quote>{quote.content}</Quote>

              <Author
                $fontSize={"24px"}
                $textColor={"#4F4F4F"}
                onClick={async () => {
                  startAnimation();
                  const quoteObj = await getQuoteByAuthor(quote.author);
                  api.stop();
                  // console.log(quoteObj);
                  setQuote(quoteObj.results);
                }}
              >
                {quote.author}
                <br />
                <Tag>{quote.tags[0]}</Tag>
              </Author>
            </div>
          )
        ) : (
          <div
            style={{
              fontWeight: "bold",
              textDecoration: "underline",
              textUnderlineOffset: ".4rem",
            }}
          >
            Click Random Button to Generate Quote
          </div>
        )}
      </main>

      <Footer>
        Develop by <DeveloperName>Akash kumar</DeveloperName> - devChallenges.io
      </Footer>
    </div>
  );
}

export default App;
