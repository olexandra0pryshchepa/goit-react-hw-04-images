import React, { useState, useEffect } from 'react';
import { fetchImages } from 'Api';
import { Loader } from './Loader/Loader';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Modal } from './Modal/Modal';
import { Button } from './Button/Button';

export const App = () => {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalHits, setTotalHits] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!searchQuery) return;

      setIsLoading(true);
      try {
        const { totalHits, hits } = await fetchImages(searchQuery, currentPage);
        setImages(prevImages => [...prevImages, ...hits]);
        setTotalHits(totalHits);
      } catch (error) {
        console.error('Error fetching images: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, currentPage]);

  const handleSearchSubmit = query => {
    setSearchQuery(query);
    setImages([]);
    setCurrentPage(1);
  };

  const loadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const openModal = largeImageURL => {
    setIsOpenModal(true);
    setModalImage(largeImageURL);
  };

  const closeModal = () => {
    setIsOpenModal(false);
    setImages(prevImages => [...prevImages]);
  };

  const showBtn = Math.ceil(totalHits / 12) > currentPage;

  return (
    <div>
      <Searchbar onSubmit={handleSearchSubmit} />
      <ImageGallery images={images} openModal={openModal} />
      {isLoading && <Loader />}
      {images.length > 0 && showBtn && <Button onClick={loadMore} />}
      {isOpenModal && (
        <Modal isOpen={isOpenModal} img={modalImage} onClose={closeModal} />
      )}
    </div>
  );
};
