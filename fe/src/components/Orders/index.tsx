import { useEffect, useState } from 'react';
import socketIo from 'socket.io-client';
import { Order } from '../../types/Order';
import { api } from '../../utils/api';
import { OrdersBoards } from '../OrdersBoards';
import { Container } from './styles';

export function Orders(){
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const socket = socketIo('http://localhost:3001', {
            transports: ['websocket'],
        });

        socket.on('orders@new', (order) => {
            setOrders(prevState => prevState.concat(order));
        });
    },[]);

    useEffect(() => {
        api.get('/orders')
            .then(({ data }) => {
                setOrders(data);
            });
    }, []);

    const waiting = orders.filter((order) => order.status === 'WAITING');
    const inProduction = orders.filter((order) => order.status === 'IN_PRODUCTION');
    const done = orders.filter((order) => order.status === 'DONE');

    function handleCancelORder(orderId: string){
        setOrders((prevSate) => prevSate.filter(order => order._id !== orderId));
    }

    function handleOrderStatusChange(orderId: string, status: Order['status']){
        setOrders((prevState) => prevState.map((order) => (
            order._id === orderId
                ? { ...order, status }
                : order
        )));
    }

    return (
        <Container>
            <OrdersBoards
                icon="🕓"
                title="Fila de espera"
                orders={waiting}
                onCancelOrder={handleCancelORder}
                onChangeOrderStatus={handleOrderStatusChange}
            />
            <OrdersBoards
                icon="🧑‍🍳"
                title="Em preparação"
                orders={inProduction}
                onCancelOrder={handleCancelORder}
                onChangeOrderStatus={handleOrderStatusChange}
            />
            <OrdersBoards
                icon="✅"
                title="Pronto!"
                orders={done}
                onCancelOrder={handleCancelORder}
                onChangeOrderStatus={handleOrderStatusChange}
            />
        </Container>
    );
}