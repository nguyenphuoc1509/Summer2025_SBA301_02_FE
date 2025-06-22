import React, { useState, useEffect } from "react";
import FilterBar from "../../../components/Cinema/FilterBar";
import ItemList from "../../../components/Cinema/ItemList";
import { personService } from "../../../services/personManagement/personService";

const Actor = () => {
  const [actors, setActors] = useState([]);
  const [genre, setGenre] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActors();
  }, []);

  const fetchActors = async () => {
    setLoading(true);
    try {
      const response = await personService.getPersonsByOccupation("ACTOR");
      if (response && response.result && response.result.content) {
        const actorsData = response.result.content.map((actor) => ({
          id: actor.id,
          poster:
            actor.images && actor.images.length > 0 ? actor.images[0] : "",
          title: actor.name,
          description: actor.biography || actor.description || "",
          views: 1000, // Placeholder value
          likes: 500, // Placeholder value
          genre: "", // These can be populated if needed
          country: actor.country || "",
        }));
        setActors(actorsData);
      }
    } catch (error) {
      console.error("Error fetching actors:", error);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    {
      label: "Thể Loại",
      value: genre,
      onChange: setGenre,
      options: [
        { label: "Tất cả", value: "" },
        { label: "Hành động", value: "action" },
        // ...
      ],
    },
    {
      label: "Quốc Gia",
      value: country,
      onChange: setCountry,
      options: [
        { label: "Tất cả", value: "" },
        { label: "Mỹ", value: "us" },
        // ...
      ],
    },
  ];

  const filteredActors = actors.filter(
    (actor) =>
      (genre === "" || actor.genre === genre) &&
      (country === "" || actor.country === country)
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 max-w-7xl mx-auto">DIỄN VIÊN</h2>
      <FilterBar filters={filters} />
      <hr className="mb-4 max-w-7xl mx-auto border-sky-700 border-2" />
      {loading ? (
        <p className="text-center">Đang tải dữ liệu...</p>
      ) : (
        <ItemList items={filteredActors} />
      )}
    </div>
  );
};

export default Actor;
