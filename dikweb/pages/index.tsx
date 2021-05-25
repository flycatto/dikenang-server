import IndexBody from '../components/body/index/IndexBody'
import Header from '../components/header/Header'
import Meta from '../components/meta/Meta'

export default function Home() {
	return (
		<div>
			{/* Default Head Meta Property */}
			<Meta title="dikenang — Keep your memories alive, forever!" />

			{/* Header Component */}
			<Header />

			{/* Body Component */}
			<IndexBody />
		</div>
	)
}
