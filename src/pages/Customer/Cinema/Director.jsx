import React, { useState, useEffect } from "react";
import FilterBar from "../../../components/Cinema/FilterBar";
import ItemList from "../../../components/Cinema/ItemList";
import { personService } from "../../../services/personManagement/personService";

const Director = () => {
  const [directors, setDirectors] = useState([]);
  const [genre, setGenre] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDirectors();
  }, []);

  const fetchDirectors = async () => {
    setLoading(true);
    try {
      const response = await personService.getPersonsByOccupation("DIRECTOR");
      if (response && response.result && response.result.content) {
        const directorsData = response.result.content.map((director) => ({
          id: director.id,
          poster:
            director.images && director.images.length > 0
              ? director.images[0]
              : "",
          title: director.name,
          description: director.biography || director.description || "",
          views: 1000, // Placeholder value
          likes: 500, // Placeholder value
          genre: "", // These can be populated if needed
          country: director.country || "",
        }));
        setDirectors(directorsData);
      }
    } catch (error) {
      console.error("Error fetching directors:", error);
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

  const filteredDirectors = directors.filter(
    (director) =>
      (genre === "" || director.genre === genre) &&
      (country === "" || director.country === country)
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 max-w-7xl mx-auto">ĐẠO DIỄN</h2>
      <FilterBar filters={filters} />
      <hr className="mb-4 max-w-7xl mx-auto border-sky-700 border-2" />
      {loading ? (
        <p className="text-center">Đang tải dữ liệu...</p>
      ) : (
        <ItemList items={filteredDirectors} />
      )}
    </div>
  );
};

export default Director;
