import { useState } from "react";
import "./App.css";

function App() {
  const [occasion, setOccasion] = useState("Birthday");
  const [relationship, setRelationship] = useState("Girlfriend");
  const [budget, setBudget] = useState(2000);
  const [interests, setInterests] = useState([]);

  const [idea, setIdea] = useState("");
  const [message, setMessage] = useState("");
  const [explanation, setExplanation] = useState("");
  const [timeline, setTimeline] = useState(null);

  const [likes, setLikes] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");




  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };




  const planSurprise = async () => {
    setLoading(true);

    // START loading

    try {
      const response = await fetch("http://127.0.0.1:5000/api/surprise/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occasion,
          relationship,
          budget,
          interests,
          description,
          likes,
          city,
        }),
      });

      const data = await response.json();

      // ✅ SET DATA
      setIdea(data.idea);
      setMessage(data.message);
      setExplanation(data.explanation);
      setTimeline(data.timeline);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // 🔥 STOP loading (THIS WAS MISSING)
    }
  };

  return (
    <div className="planner-card">

      <h1>🎁 AI Surprise Planner</h1>

      {/* Occasion + Relationship */}
      <div className="row">
        <select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
          <option>Birthday</option>
          <option>Anniversary</option>
        </select>

        <select value={relationship} onChange={(e) => setRelationship(e.target.value)}>
          <option>Girlfriend</option>
          <option>Boyfriend</option>
          <option>Friend</option>
        </select>
      </div>
      <select name="tone">
        <option>Romantic</option>
        <option>Funny</option>
        <option>Luxury</option>
        <option>Minimal</option>
        <option>Adventure</option>
      </select>


      {/* Describe person */}
      <textarea
        className="big-textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the person, their personality, likes, memories..."
      />

      {/* Interests */}
      <div className="interests">
        <label><input type="checkbox" /> Music</label>
        <label><input type="checkbox" /> Travel</label>
        <label><input type="checkbox" /> Food</label>
      </div>

      {/* Budget */}
      <input
        type="number"
        placeholder="Budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      />

      {/* Button */}
      <button onClick={planSurprise}>
        Plan My Surprise
      </button>


      {/* ✅ RESULT SECTION */}
      {!loading && idea && (
        <div className="result">
          <h2>🎉 Surprise Idea</h2>
          <p>{idea}</p>

          <h2>💌 Message</h2>
          <p>{message}</p>

          <h2>🧠 Explanation</h2>
          <p>{explanation}</p>
        </div>
      )}
      {timeline && (
        <div className="timeline">
          <h2>🕒 Surprise Timeline</h2>

          <h3>Before</h3>
          <ul>
            {timeline.before.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>

          <h3>During</h3>
          <ul>
            {timeline.during.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>

          <h3>After</h3>
          <ul>
            {timeline.after.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>
      )}



    </div>
  );
}

export default App;
