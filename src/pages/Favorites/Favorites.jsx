import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { selectFavorites } from "../../redux/favorites/selectors";
import { Link } from "react-router-dom";
import { selectTheme } from "../../redux/auth/selectors";
import {
  fetchFavoritesByTeacherIds,
  fetchFavorites,
} from "../../redux/favorites/operations";
import CardsList from "../../components/CardsList/CardsList";
import DocumentTitle from "../../components/DocumentTitle";
import css from "./Favorites.module.css";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const favotiteIds = useSelector(selectFavorites);

  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchFavoritesByTeacherIds(favotiteIds))
      .unwrap()
      .then((data) => {
        setFavorites(data);
      });
  }, [dispatch, favotiteIds]);

  return (
    <>
      <DocumentTitle>Favorites</DocumentTitle>
      <div className={css.container}>
        <section className={css.content}>
          <h2 className="visually-hidden"> Favorites</h2>
          {favorites && favorites.length !== 0 ? (
            <CardsList teachers={favorites} />
          ) : (
            <Link to="/teachers" className={css.link}>
              <span className={clsx(css.text, css[theme])}>
                Looks like you have not added any teachers to your favorites
                yet...
              </span>
            </Link>
          )}
        </section>
      </div>
    </>
  );
}
