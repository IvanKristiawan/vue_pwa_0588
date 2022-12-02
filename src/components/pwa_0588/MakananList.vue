<template>
    <v-main class="list">
        <v-card>
            <v-list-item>
                <v-list-item-avatar> <img
                        src="https://thumbs.dreamstime.com/b/cute-panda-bear-cartoon-chef-vectorcooking-cookie-sweet-bakery-cute-panda-bear-cartoon-chef-vector-cooking-cookiesweet-bakery-216614619.jpg"
                        alt="John"></v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title class="headline">Makanan </v-list-item-title>
                    <v-list-item-subtitle>by NPM Kalian</v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" outlined hide details
                    style="margin-top: 30px"></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="primary" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>
        </v-card>
        <v-card>
            <v-data-table :headers="headers" :items="todos" :search="search" item-key="name" class="elevation-1">
                <template v-slot:[`item.calories`]="{ item }">
                    <v-chip :color="getColor(item.calories)" style="color: white;">
                        {{ item.calories }}
                    </v-chip>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn class="ma-2" outlined small color="error" @click="editItem(item)"><v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn v-if="item.status === 'Ready'" class="ma-2" outlined small color="success"
                        @click="openDelete(item)">
                        <v-icon>
                            mdi-trash-can-outline
                        </v-icon>
                    </v-btn>
                    <v-btn v-else class="ma-2" outlined small color="success" @click="openDelete(item)" disabled>
                        <v-icon>
                            mdi-trash-can-outline
                        </v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog transition="dialog-top-transition" v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-toolbar color="brown darken-1" dark class="headline">Tambah Pesanan</v-toolbar>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="formTodo.name" label="Name" required></v-text-field>
                        <v-text-field v-model="formTodo.calories" label="Calories" required></v-text-field>
                        <v-textarea v-model="formTodo.note" label="Note" required></v-textarea>
                        <v-select v-model="formTodo.status" :items="[`Ready`, `On Process`, 'Delivery']" label="Status"
                            required></v-select>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="save"> Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogEdit" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline"> Edit Makanan </span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="formTodo.name" label="Name" required></v-text-field>
                        <v-text-field v-model="formTodo.calories" label="Calories" required></v-text-field>
                        <v-textarea v-model="formTodo.note" label="Note" required></v-textarea>
                        <v-select v-model="formTodo.status" :items="[`Ready`, `On Process`, 'Delivery']" label="Status"
                            required></v-select>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancelEdit"> Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="saveEdit"> Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" persistent max-width="290">
            <template v-slot:activator="{}">
            </template>
            <v-card>
                <v-card-title class="text-h5">
                    Are you sure to delete?
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="dialogDelete = false">
                        cancel
                    </v-btn>
                    <v-btn color="red darken-1" text @click="deleteItem()">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-main>
</template>
<script>
export default {
    name: "MakananList",
    data() {
        return {
            tempPriority: "",
            editItemnya: {},
            indexnya: 0,
            indexnyaEdit: 0,
            search: null,
            dialog: false,
            dialogEdit: false,
            dialogDelete: false,
            snackbar: false,
            timeout: 1000,
            itemContent: [],
            indexItem: null,
            headers: [
                {
                    text: "Name",
                    align: "start",
                    sortable: true,
                    value: "name",
                },
                { text: "Calories", value: "calories" },
                { text: "Note", value: "note" },
                { text: "Status", value: "status" },
                { text: "Actions", value: "actions" },
            ],
            todos: [
                {
                    name: "Fried Rice",
                    calories: 120,
                    note: "Tidak pakai cabe",
                    status: "On Process",
                },
                {
                    name: "Dessert",
                    calories: 350,
                    note: "Tambah alat makan",
                    status: "Ready",
                },
                {
                    name: "Ice Cream",
                    calories: 450,
                    note: "Rasa coklat dan stroberi aja",
                    status: "Delivery",
                },
            ],
            formTodo: {
                name: null,
                calories: null,
                note: null,
                status: null,
            },
            formTodoEdit: {
                name: null,
                calories: null,
                note: null,
            },
        };
    },
    methods: {
        save() {
            // tambahkan code untuk dapat menyimpan data yang ingin ditambah
            this.todos.push(this.formTodo);
            this.resetForm()
            this.dialog = false
        },
        cancel() {
            // tambahkan code untuk batal tambah data
            this.resetForm()
            this.dialog = false
        },
        openDelete(item) {
            this.dialogDelete = true
            for (let i = 0; i < this.todos.length; i++) {
                if (this.todos[i].task === item.task) {
                    this.indexnya = i
                }
            }
        },
        deleteItem() {
            this.todos.splice(this.indexnya, 1);
            this.dialogDelete = false
        },
        editItem(item) {
            this.dialogEdit = true
            this.formTodo.name = item.name
            this.formTodo.calories = item.calories
            this.formTodo.note = item.note
            this.formTodo.status = item.status
            this.editItemnya = item
        },
        saveEdit() {
            this.editItemnya.name = this.formTodo.name
            this.editItemnya.calories = this.formTodo.calories
            this.editItemnya.note = this.formTodo.note
            this.editItemnya.status = this.formTodo.status
            this.dialogEdit = false
        },
        cancelEdit() {
            this.resetForm()
            this.dialogEdit = false
        },
        resetForm() {
            this.formTodo = {
                name: null,
                calories: null,
                note: null,
                status: null,
            };
            this.formTodoEdit = {
                name: null,
                calories: null,
                note: null,
                status: null,
            };
        },
        getColor(prior) {
            if (prior > 100 && prior < 300) return 'green'
            else if (prior > 300 && prior < 400) return 'yellow'
            else return 'red'
        },
        //tambahkan code untuk delete data
        //tambahkan code untuk menampilkan data list yang ingin diedit
        //tambahkan code untuk memberikan ketentuan warna sesuai calories
    },
};
</script>
<style>
.text {
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
    font-size: 40px;
    font-style: italic;
}
</style>